package com.ecom.ecom.security;

import com.ecom.ecom.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private static final String ISSUER = "ecom-api";

    private final SecretKey key;
    private final long accessExpirationMs;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.access-expiration-ms}") long accessExpirationMs) {
        byte[] bytes = Decoders.BASE64.decode(secret);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET must be a base64 string of at least 32 bytes (256 bits)");
        }
        this.key = Keys.hmacShaKeyFor(bytes);
        this.accessExpirationMs = accessExpirationMs;
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        return Jwts.builder()
                .issuer(ISSUER)
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + accessExpirationMs))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .requireIssuer(ISSUER)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getAccessExpirationSeconds() {
        return accessExpirationMs / 1000;
    }
}