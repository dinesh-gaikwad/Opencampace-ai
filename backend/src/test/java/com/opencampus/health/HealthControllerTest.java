package com.opencampus.health;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class HealthControllerTest {
    @Test
    void healthResponseHasOkStatus() {
        var result = new HealthController().health();
        assertThat(result.get("status")).isEqualTo("ok");
        assertThat(result.get("service")).isEqualTo("opencampus-api");
    }
}
