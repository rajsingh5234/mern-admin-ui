import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import TenantsFilter from "./TenantsFilter";
import { useAuthStore } from "../../store";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const Tenants = () => {

    const { user } = useAuthStore();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data: tenants, isLoading, isError, error } = useQuery({
        queryKey: ['Users'],
        queryFn: () => {
            return getTenants().then((res) => res.data);
        }
    })

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Restaurants' }]}
                />

                {isLoading && <div>Loading...</div>}
                {isError && <div>{error.message}</div>}

                <TenantsFilter
                    onFillterChange={(filterName: string, filterValue: string) => {
                        console.log(filterName, filterValue);
                    }}
                >
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Add Restaurant
                    </Button>
                </TenantsFilter>

                <Table columns={columns} dataSource={tenants} rowKey={'id'} />

                <Drawer
                    title="Create restaurant"
                    width={720}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    extra={
                        <Space>
                            <Button>Cancel</Button>
                            <Button type="primary">Submit</Button>
                        </Space>
                    }
                >
                    Content
                </Drawer>
            </Space>
        </>
    )
}

export default Tenants