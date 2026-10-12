package fu.se.chapter15api.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fu.se.chapter15api.dto.OrchidRequest;
import fu.se.chapter15api.dto.OrchidResponse;
import fu.se.chapter15api.exception.ResourceNotFoundException;
import fu.se.chapter15api.model.Orchid;
import fu.se.chapter15api.repository.OrchidRepository;

@Service
@Transactional
public class OrchidService {

    private final OrchidRepository orchidRepository;

    public OrchidService(OrchidRepository orchidRepository) {
        this.orchidRepository = orchidRepository;
    }

    @Transactional(readOnly = true)
    public List<OrchidResponse> findAll() {
        return orchidRepository.findAll(Sort.by(Sort.Direction.ASC, "orchidId"))
                .stream()
                .map(OrchidResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrchidResponse findById(Integer id) {
        return OrchidResponse.from(findOrchid(id));
    }

    public OrchidResponse create(OrchidRequest request) {
        Orchid orchid = new Orchid(
                request.orchidName().trim(),
                request.isNatural(),
                request.orchidDescription() != null ? request.orchidDescription().trim() : null,
                request.orchidCategory() != null ? request.orchidCategory().trim() : null,
                request.isAttractive(),
                request.orchidURL() != null ? request.orchidURL().trim() : null
        );
        return OrchidResponse.from(orchidRepository.save(orchid));
    }

    public OrchidResponse update(Integer id, OrchidRequest request) {
        Orchid orchid = findOrchid(id);
        orchid.setOrchidName(request.orchidName().trim());
        orchid.setIsNatural(request.isNatural());
        orchid.setOrchidDescription(request.orchidDescription() != null ? request.orchidDescription().trim() : null);
        orchid.setOrchidCategory(request.orchidCategory() != null ? request.orchidCategory().trim() : null);
        orchid.setIsAttractive(request.isAttractive());
        orchid.setOrchidURL(request.orchidURL() != null ? request.orchidURL().trim() : null);
        return OrchidResponse.from(orchidRepository.save(orchid));
    }

    public void delete(Integer id) {
        orchidRepository.delete(findOrchid(id));
    }

    private Orchid findOrchid(Integer id) {
        if (id == null) {
            throw new ResourceNotFoundException("Không tìm thấy hoa lan với id " + id);
        }
        return orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hoa lan với id " + id));
    }
}
