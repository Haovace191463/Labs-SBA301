import {useState} from 'react';

import {Button, Col, Container, Row} from 'react-bootstrap';

import useOrchids from '../hooks/useOrchids';

import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import OrchidCard from './OrchidCard';
import OrchidDetailModal from './OrchidDetailModal';

export default function Orchids() {
    const {orchids, loading, error, reload} = useOrchids();

    const [show, setShow] = useState(false);
    const [selectedOrchid, setSelectedOrchid] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [category, setCategory] = useState('All');
    const [specialOnly, setSpecialOnly] = useState(false);

    const categories = [
        'All',
        ...new Set(orchids.map((orchid) => orchid.category)),
    ];

    const visibleOrchids = orchids.filter((orchid) => {
        const matchesSearch = orchid.orchidName
            .toLowerCase()
            .includes(searchText.toLowerCase());

        const matchesCategory =
            category === 'All' || orchid.category === category;

        const matchesSpecial =
            !specialOnly || orchid.isSpecial;

        return matchesSearch && matchesCategory && matchesSpecial;
    });

    const handleShow = (orchid) => {
        setSelectedOrchid(orchid);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedOrchid(null);
    };

    return (
        <Container id="orchids" className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Orchids List</h2>

                <Button
                    variant="outline-primary"
                    onClick={reload}
                    disabled={loading}
                >
                    Reload
                </Button>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-md-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm Orchid..."
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-3 d-flex align-items-center">
                    <div className="form-check">
                        <input
                            id="specialOnly"
                            className="form-check-input"
                            type="checkbox"
                            checked={specialOnly}
                            onChange={(event) =>
                                setSpecialOnly(event.target.checked)
                            }
                        />

                        <label
                            className="form-check-label"
                            htmlFor="specialOnly"
                        >
                            Special only
                        </label>
                    </div>
                </div>
            </div>

            {loading && <LoadingSpinner/>}

            {error && (
                <ErrorMessage
                    message={error}
                    onRetry={reload}
                />
            )}

            {!loading && !error && orchids.length === 0 && (
                <p>Không có Orchid nào.</p>
            )}

            {!loading && !error && orchids.length > 0 && (
                <Row>
                    {visibleOrchids.map((orchid) => (
                        <Col
                            xs={12}
                            sm={6}
                            lg={3}
                            key={orchid.id}
                            className="mb-4"
                        >
                            <OrchidCard
                                orchid={orchid}
                                onDetail={handleShow}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            <OrchidDetailModal
                show={show}
                orchid={selectedOrchid}
                onClose={handleClose}
            />
        </Container>
    );
}