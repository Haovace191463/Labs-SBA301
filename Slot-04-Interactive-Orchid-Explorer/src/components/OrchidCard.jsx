import {useState} from "react";
import {Badge, Button, Card, Modal} from "react-bootstrap";

function OrchidCard({orchid}) {
    const [showDetail, setShowDetail] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    return (
        <>
            <Card className="h-100 shadow-sm">
                <Card.Img
                    variant="top"
                    src={orchid.image}
                    alt={orchid.orchidName}
                    className="orchid-image"
                />
                <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                        <Card.Title>{orchid.orchidName}</Card.Title>
                        {orchid.isSpecial && <Badge bg="warning" text="dark">Special</Badge>}
                    </div>
                    <Card.Text>
                        Category: {orchid.category}<br/>
                        Origin: {orchid.origin}<br/>
                        Rating: {orchid.rating}
                    </Card.Text>
                    <Button
                        className="mt-auto"
                        variant="primary"
                        onClick={() => setShowDetail(true)}
                    >
                        View Detail
                    </Button>

                    <Button
                        variant={isFavorite ? "danger" : "outline-danger"}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        {isFavorite ? "Favorite" : "Add Favorite"}
                    </Button>
                </Card.Body>
            </Card>
            <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{orchid.orchidName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Category:</strong> {orchid.category}</p>
                    <p><strong>Origin:</strong> {orchid.origin}</p>
                    <p><strong>Color:</strong> {orchid.color}</p>
                    <p><strong>Rating:</strong> {orchid.rating}</p>
                    <p className="mb-0">{orchid.description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetail(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OrchidCard;