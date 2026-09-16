import { Badge, Card } from "react-bootstrap";

function EventCard({ event, onSelect }) {
    return (
        <Card className="h-100 shadow-sm"
              onClick={() => onSelect(event)}>
            <Card.Img
                variant="top"
                src={event.image}
                alt={event.title}
            />

            <Card.Body>
                <div className="d-flex justify-content-between align-items-start gap-2">
                    <Card.Title>{event.title}</Card.Title>

                    {event.featured && (
                        <Badge bg="warning" text="dark">
                            Featured
                        </Badge>
                    )}
                </div>

                <Card.Text className="mb-1">
                    <strong>Category:</strong> {event.category}
                </Card.Text>

                <Card.Text className="mb-1">
                    <strong>Date:</strong> {event.date}
                </Card.Text>

                <Card.Text>
                    <strong>Location:</strong> {event.location}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default EventCard;