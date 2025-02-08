import { Card, Col, Input, Row, Select } from 'antd';

type UsersFilterProps = {
    children?: React.ReactNode;
    onFillterChange: (filterName: string, filterValue: string) => void;
};
const UsersFilter = ({ children, onFillterChange }: UsersFilterProps) => {
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
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                allowClear={true}
                                placeholder="Select role"
                                onChange={(selectedItem) => onFillterChange('roleFilter', selectedItem)}
                            >
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="manager">Manager</Select.Option>
                                <Select.Option value="customer">Customer</Select.Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Status"
                                allowClear={true}
                                onChange={(selectedItem) => onFillterChange('statusFilter', selectedItem)}
                            >
                                <Select.Option value="ban">Ban</Select.Option>
                                <Select.Option value="active">Active</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default UsersFilter;
