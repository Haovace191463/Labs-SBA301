import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Breadcrumbs component
 * @param {Array<{ label: string, path?: string }>} items
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className="mb-3">
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
        Home
      </Breadcrumb.Item>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.path) {
          return (
            <Breadcrumb.Item key={index} active>
              {item.label}
            </Breadcrumb.Item>
          );
        }
        return (
          <Breadcrumb.Item key={index} linkAs={Link} linkProps={{ to: item.path }}>
            {item.label}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
