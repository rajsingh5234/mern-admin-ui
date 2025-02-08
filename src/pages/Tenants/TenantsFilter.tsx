import { Card, Col, Input, Row } from 'antd';

type TenantsFilterProps = {
    children?: React.ReactNode;
    onFillterChange: (filterName: string, filterValue: string) => void;
};

const TenantsFilter = ({ children, onFillterChange }: TenantsFilterProps) => {
    return (
        <Card>
            <Row justify="space-between">
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Input.Search
                                allowClear={true}
                                placeholder="Search"
                                onChange={(e) => onFillterChange('searchFilter', e.target.value)}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default TenantsFilter