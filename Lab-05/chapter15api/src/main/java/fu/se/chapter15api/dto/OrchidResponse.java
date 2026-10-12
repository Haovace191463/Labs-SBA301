package fu.se.chapter15api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import fu.se.chapter15api.model.Orchid;

public record OrchidResponse(
        Integer orchidId,
        String orchidName,
        @JsonProperty("isNatural") Boolean isNatural,
        String orchidDescription,
        String orchidCategory,
        @JsonProperty("isAttractive") Boolean isAttractive,
        @JsonProperty("orchidURL") String orchidURL
) {

    @JsonProperty("natural")
    public Boolean natural() {
        return isNatural;
    }

    @JsonProperty("attractive")
    public Boolean attractive() {
        return isAttractive;
    }

    @JsonProperty("orchidUrl")
    public String orchidUrl() {
        return orchidURL;
    }

    public static OrchidResponse from(Orchid orchid) {
        return new OrchidResponse(
                orchid.getOrchidId(),
                orchid.getOrchidName(),
                orchid.getIsNatural(),
                orchid.getOrchidDescription(),
                orchid.getOrchidCategory(),
                orchid.getIsAttractive(),
                orchid.getOrchidURL()
        );
    }
}
