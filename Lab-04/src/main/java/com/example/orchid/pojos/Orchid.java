package com.example.orchid.pojos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "orchids")
public class Orchid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orchid_id")
    @JsonProperty("orchidID")
    private Long orchidID;

    @Column(name = "orchid_name", nullable = false, length = 150)
    private String orchidName;

    @Column(name = "is_natural")
    private Boolean isNatural;

    @Column(name = "orchid_description", length = 1000)
    private String orchidDescription;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private OrchidCategory orchidCategory;

    @Column(name = "is_attractive")
    private Boolean isAttractive;

    @Column(name = "orchid_url", length = 2048)
    private String orchidURL;

    public Orchid() {
    }

    public Orchid(String orchidName, Boolean isNatural, String orchidDescription,
                  OrchidCategory orchidCategory, Boolean isAttractive, String orchidURL) {
        this.orchidName = orchidName;
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidCategory = orchidCategory;
        this.isAttractive = isAttractive;
        this.orchidURL = orchidURL;
    }

    public Long getOrchidID() {
        return orchidID;
    }

    public void setOrchidID(Long orchidID) {
        this.orchidID = orchidID;
    }

    public Long getOrchidId() {
        return orchidID;
    }

    public void setOrchidId(Long orchidId) {
        this.orchidID = orchidId;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }

    public Boolean getIsNatural() {
        return isNatural;
    }

    public void setIsNatural(Boolean isNatural) {
        this.isNatural = isNatural;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public OrchidCategory getOrchidCategory() {
        return orchidCategory;
    }

    public void setOrchidCategory(OrchidCategory orchidCategory) {
        this.orchidCategory = orchidCategory;
    }

    public Boolean getIsAttractive() {
        return isAttractive;
    }

    public void setIsAttractive(Boolean isAttractive) {
        this.isAttractive = isAttractive;
    }

    public String getOrchidURL() {
        return orchidURL;
    }

    public void setOrchidURL(String orchidURL) {
        this.orchidURL = orchidURL;
    }
}
