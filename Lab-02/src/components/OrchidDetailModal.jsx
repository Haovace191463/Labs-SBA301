import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

export default function OrchidDetailModal({ show, orchid, onClose }) {
    if (!orchid) {
        return null;
    }

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{orchid.orchidName}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <img
                    src={orchid.image}
                    alt={orchid.orchidName}
                    className="img-fluid rounded mb-3"
                />

                <p>
                    <strong>Category:</strong> {orchid.category}
                </p>

                <p>
                    <strong>Origin:</strong> {orchid.origin}
                </p>

                <p>
                    <strong>Color:</strong> {orchid.color}
                </p>

                <p>
                    <strong>Rating:</strong> {orchid.rating}
                </p>

                <p>
                    <strong>Special:</strong>{' '}
                    {orchid.isSpecial ? (
                        <Badge bg="warning" text="dark">
                            Yes
                        </Badge>
                    ) : (
                        'No'
                    )}
                </p>

                <p>{orchid.description}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}