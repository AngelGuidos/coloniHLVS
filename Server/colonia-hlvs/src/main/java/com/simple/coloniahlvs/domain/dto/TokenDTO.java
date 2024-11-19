package com.simple.coloniahlvs.domain.dto;

import com.simple.coloniahlvs.domain.entities.Token;
import lombok.Data;

@Data
public class TokenDTO {

    private String token;

    public TokenDTO(Token token) {
        this.token = token.getContent();
    }

}
