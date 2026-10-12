package fu.se.chapter15api.exception;

import java.time.Instant;

public record ApiError(Instant timestamp, int status, String message) {
}
