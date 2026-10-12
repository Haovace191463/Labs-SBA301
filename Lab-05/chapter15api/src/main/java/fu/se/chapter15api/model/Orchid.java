package fu.se.chapter15api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Orchid")
public class Orchid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrchidID")
    private Integer orchidId;

    @Column(name = "OrchidName", nullable = false, length = 100)
    private String orchidName;

    @Column(name = "IsNatural", nullable = false)
    private Boolean isNatural;

    @Column(name = "OrchidDescription", length = 500)
    private String orchidDescription;

    @Column(name = "OrchidCategory", length = 100)
    private String orchidCategory;

    @Column(name = "IsAttractive", nullable = false)
    private Boolean isAttractive;

    @Column(name = "OrchidURL", length = 500)
    private String orchidURL;

    public Orchid() {
    }

    public Orchid(String orchidName, Boolean isNatural, String orchidDescription,
                  String orchidCategory, Boolean isAttractive, String orchidURL) {
        this.orchidName = orchidName;
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidCategory = orchidCategory;
        this.isAttractive = isAttractive;
        this.orchidURL = orchidURL;
    }

    public Integer getOrchidId() {
        return orchidId;
    }

    public void setOrchidId(Integer orchidId) {
        this.orchidId = orchidId;
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

    public boolean isNatural() {
        return Boolean.TRUE.equals(isNatural);
    }

    public void setNatural(boolean natural) {
        this.isNatural = natural;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public String getOrchidCategory() {
        return orchidCategory;
    }

    public void setOrchidCategory(String orchidCategory) {
        this.orchidCategory = orchidCategory;
    }

    public Boolean getIsAttractive() {
        return isAttractive;
    }

    public void setIsAttractive(Boolean isAttractive) {
        this.isAttractive = isAttractive;
    }

    public boolean isAttractive() {
        return Boolean.TRUE.equals(isAttractive);
    }

    public void setAttractive(boolean attractive) {
        this.isAttractive = attractive;
    }

    public String getOrchidURL() {
        return orchidURL;
    }

    public void setOrchidURL(String orchidURL) {
        this.orchidURL = orchidURL;
    }

    public String getOrchidUrl() {
        return orchidURL;
    }

    public void setOrchidUrl(String orchidUrl) {
        this.orchidURL = orchidUrl;
    }
}
