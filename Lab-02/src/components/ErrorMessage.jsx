import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default function ErrorMessage({ message, onRetry }) {
    return (
        <Alert variant="danger">
            <Alert.Heading>Không thể tải dữ liệu</Alert.Heading>

            <p>{message}</p>

            {onRetry && (
                <Button variant="outline-danger" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </Alert>
    );
}