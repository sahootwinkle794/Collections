package com.ecom.ecom.exception;

import lombok.extern.slf4j.Slf4j;
import com.ecom.ecom.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 - Resource not found (e.g., product/category/user id doesn't exist)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        ErrorResponse error = buildError(HttpStatus.NOT_FOUND, ex.getMessage(), request);
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // 409 - Duplicate resource (e.g., email already registered, duplicate styleId)
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(
            DuplicateResourceException ex, HttpServletRequest request) {
        ErrorResponse error = buildError(HttpStatus.CONFLICT, ex.getMessage(), request);
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // 400 - Not enough stock to fulfill an order
    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientStock(
            InsufficientStockException ex, HttpServletRequest request) {
        ErrorResponse error = buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 400 - Generic invalid request/business rule violation
    @ExceptionHandler(InvalidRequestException.class)
    public ResponseEntity<ErrorResponse> handleInvalidRequest(
            InvalidRequestException ex, HttpServletRequest request) {
        ErrorResponse error = buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 401 - Custom unauthorized cases (e.g., token expired, not logged in)
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(
            UnauthorizedException ex, HttpServletRequest request) {
        ErrorResponse error = buildError(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // 401 - Wrong email/password on login (Spring Security throws this)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest request) {
        ErrorResponse error = buildError(HttpStatus.UNAUTHORIZED, "Invalid email or password", request);
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // 403 - Logged in, but not allowed to do this action (e.g., customer hitting admin endpoint)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest request) {
        ErrorResponse error = buildError(HttpStatus.FORBIDDEN, "You don't have permission to perform this action", request);
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    // 400 - Bean validation failures (e.g., @NotBlank, @NotNull on request DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex, HttpServletRequest request) {

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fe ->
                fieldErrors.put(fe.getField(), fe.getDefaultMessage())
        );

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Failed")
                .message("One or more fields are invalid")
                .path(request.getRequestURI())
                .fieldErrors(fieldErrors)
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 400 - Wrong type in path variable/query param (e.g., /api/products/abc instead of a number)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String message = String.format("'%s' should be a valid %s",
                ex.getName(), ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "value");
        ErrorResponse error = buildError(HttpStatus.BAD_REQUEST, message, request);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 409 - Database-level constraint violations (e.g., unique/not-null constraint hit directly)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        ErrorResponse error = buildError(HttpStatus.CONFLICT,
                "This operation violates a database constraint (possibly a duplicate value)", request);
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // 400 - Catch-all for any other RuntimeException (e.g., our own thrown RuntimeExceptions)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(
            RuntimeException ex, HttpServletRequest request) {
        log.warn("Unhandled RuntimeException on {}", request.getRequestURI(), ex);
        ErrorResponse error = buildError(HttpStatus.BAD_REQUEST, "Invalid request", request);
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // 500 - True catch-all for anything unexpected
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, HttpServletRequest request) {
        log.error("Unexpected error on {}", request.getRequestURI(), ex);
        ErrorResponse error = buildError(HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong. Please try again later.", request);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ErrorResponse buildError(HttpStatus status, String message, HttpServletRequest request) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(request.getRequestURI())
                .build();
    }
}