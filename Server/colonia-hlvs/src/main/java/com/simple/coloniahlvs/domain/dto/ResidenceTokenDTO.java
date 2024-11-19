package com.simple.coloniahlvs.domain.dto;

import com.simple.coloniahlvs.domain.entities.Residence_Token;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResidenceTokenDTO {
    private String token;

    public ResidenceTokenDTO(Residence_Token token) {
        this.token = token.getContent();
    }
}
