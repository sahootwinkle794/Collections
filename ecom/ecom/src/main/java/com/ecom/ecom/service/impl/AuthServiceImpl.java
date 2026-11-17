package com.ecom.ecom.service.impl;

import com.ecom.ecom.dto.AuthResponse;
import com.ecom.ecom.entity.RefreshToken;
import com.ecom.ecom.entity.Role;
import com.ecom.ecom.entity.User;
import com.ecom.ecom.exception.UnauthorizedException;
import com.ecom.ecom.repository.RefreshTokenRepository;
import com.ecom.ecom.repository.UserRepository;
import com.ecom.ecom.security.JwtService;
import com.ecom.ecom.service.AuthService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    // ---------- LOGIN ----------
    @Override
    @Transactional
    public AuthResponse loginWithFirebase(String idToken) {
        FirebaseToken decoded;
        try {
            decoded = firebaseAuth.verifyIdToken(idToken, true); // true = also check revoked
        } catch (FirebaseAuthException | IllegalArgumentException e) {
            log.warn("Firebase token rejected: {}", e.getMessage());
            throw new UnauthorizedException("Invalid or expired login");
        }

        if (decoded.getEmail() == null || !decoded.isEmailVerified()) {
            throw new UnauthorizedException("Email is not verified");
        }

        String email = decoded.getEmail().trim().toLowerCase();
        String uid = decoded.getUid();

        User user = userRepository.findByFirebaseUid(uid)
                .or(() -> userRepository.findByEmail(email))
                .orElseGet(() -> User.builder()
                        .email(email)
                        .firebaseUid(uid)
                        .fullName(truncate(decoded.getName(), 150))
                        .role(Role.CUSTOMER)   // always CUSTOMER; promote admins manually in DB
                        .build());

        if (user.getFirebaseUid() == null) {
            user.setFirebaseUid(uid);
        } else if (!user.getFirebaseUid().equals(uid)) {
            throw new UnauthorizedException("Invalid or expired login");
        }

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Account is disabled");
        }

        user.setLastLoginAt(Instant.now());
        user = userRepository.save(user);

        return issueTokens(user);
    }

    // ---------- REFRESH ----------
    // noRollbackFor: on token reuse we revoke all sessions THEN throw; without this the revoke would roll back
    @Override
    @Transactional(noRollbackFor = UnauthorizedException.class)
    public AuthResponse refresh(String rawRefreshToken) {
        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash(rawRefreshToken))
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (stored.isRevoked()) {
            // an already-used token came back = possible theft, kill all sessions of this user
            refreshTokenRepository.revokeAllForUser(stored.getUser().getId());
            throw new UnauthorizedException("Invalid refresh token");
        }
        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw new UnauthorizedException("Refresh token expired");
        }

        User user = stored.getUser();
        if (!user.isEnabled()) {
            throw new UnauthorizedException("Account is disabled");
        }

        stored.setRevoked(true); // one-time use
        refreshTokenRepository.save(stored);
        return issueTokens(user);
    }

    // ---------- LOGOUT ----------
    @Override
    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenRepository.findByTokenHash(hash(rawRefreshToken)).ifPresent(t -> {
            t.setRevoked(true);
            refreshTokenRepository.save(t);
        });
    }

    // ---------- HELPERS ----------
    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user);

        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String rawRefresh = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        refreshTokenRepository.save(RefreshToken.builder()
                .tokenHash(hash(rawRefresh))
                .user(user)
                .expiresAt(Instant.now().plusMillis(refreshExpirationMs))
                .build());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefresh)
                .expiresIn(jwtService.getAccessExpirationSeconds())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    private static String hash(String value) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(md.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private static String truncate(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max);
    }
}