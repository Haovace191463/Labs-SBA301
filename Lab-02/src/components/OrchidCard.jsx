import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

export default function OrchidCard({ orchid, onDetail }) {
    return (
        <Card className="orchid-card shadow-sm">
            <Card.Img
                variant="top"
                src={orchid.image}
                alt={orchid.orchidName}
                className="orchid-card-img"
            />

            <Card.Body>
                <Card.Title>{orchid.orchidName}</Card.Title>

                {orchid.isSpecial && (
                    <Badge bg="warning" text="dark" className="mb-2">
                        Special
                    </Badge>
                )}

                <Card.Text>
                    Category: {orchid.category}
                </Card.Text>

                <Button
                    variant="primary"
                    onClick={() => onDetail(orchid)}
                >
                    Detail
                </Button>
            </Card.Body>
        </Card>
    );
}