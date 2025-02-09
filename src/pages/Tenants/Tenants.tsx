import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Breadcrumb, Button, Drawer, Space, Table, Form, theme, Flex, Spin, Typography } from "antd";
import { LoadingOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";
import TenantsFilter from "./TenantsFilter";
import { useAuthStore } from "../../store";
import TenantForm from "./Forms/TenantForm";
import { CreateTenantData, FieldData } from "../../types";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";

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

    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();

    const queryClient = useQueryClient();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const { data: tenants, isFetching, isError, error } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();
            return getTenants(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData
    })

    const { mutate: tenantMutate } = useMutation({
        mutationKey: ['tenant'],
        mutationFn: async (data: CreateTenantData) => createTenant(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
            return;
        },
    });

    const onHandleSubmit = async () => {
        await form.validateFields();
        await tenantMutate(form.getFieldsValue());
        form.resetFields();
        setDrawerOpen(false);
    }

    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
        }, 500);
    }, []);

    const onFilterChange = (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields
            .map((item) => ({
                [item.name[0]]: item.value,
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {});

        if ('q' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q);
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields, currentPage: 1 }));
        }
    };

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }

    return (
        <>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Flex justify="space-between">
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Restaurants' }]}
                    />

                    {isFetching && (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    )}
                    {isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
                </Flex>

                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <TenantsFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}
                        >
                            Add Restaurant
                        </Button>
                    </TenantsFilter>
                </Form>

                <Table
                    columns={columns}
                    dataSource={tenants?.data || []}
                    rowKey={'id'}
                    pagination={{
                        total: tenants?.total,
                        pageSize: queryParams.perPage,
                        current: queryParams.currentPage,
                        onChange: (page) => {
                            setQueryParams((prev) => {
                                return {
                                    ...prev,
                                    currentPage: page,
                                };
                            });
                        },
                    }}
                />

                <Drawer
                    title="Create restaurant"
                    styles={{ body: { backgroundColor: colorBgLayout } }}
                    width={720}
                    destroyOnClose={true}
                    open={drawerOpen}
                    onClose={() => {
                        form.resetFields();
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    setDrawerOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                onClick={onHandleSubmit}
                            >
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" form={form}>
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Tenants