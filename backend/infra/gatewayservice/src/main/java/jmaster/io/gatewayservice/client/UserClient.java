package jmaster.io.gatewayservice.client;

import com.google.common.net.HttpHeaders;
import jmaster.io.gatewayservice.dto.UserDTO;
import org.example.commonlib.dto.BaseResponse;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class UserClient {

    private final WebClient authWebClient;

    public UserClient(WebClient authWebClient) {
        this.authWebClient = authWebClient;
    }
    public BaseResponse<UserDTO> getUserById(Long id) {
        return authWebClient.get()
                .uri("/users/{id}", id)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<BaseResponse<UserDTO>>() {})
                .block();
    }

}



