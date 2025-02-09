import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd"
import { PlusOutlined, RightOutlined } from '@ant-design/icons'
import { Link, Navigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUser, getUsers } from "../../http/api"
import { CreateUserData, User } from "../../types"
import { useAuthStore } from "../../store"
import UsersFilter from "./UsersFilter"
import { useState } from "react"
import UserForm from "./Forms/UserForm"
import { PER_PAGE } from "../../constants"

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {
            return (
                <div>
                    {record.firstName} {record.lastName}
                </div>
            );
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    }
];

const Users = () => {

    const { user } = useAuthStore();

    const [form] = Form.useForm();

    const queryClient = useQueryClient();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const { data: users, isLoading, isError, error } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: () => {
            const queryString = new URLSearchParams(
                queryParams as unknown as Record<string, string>
            ).toString();
            return getUsers(queryString).then((res) => res.data);
        }
    })

    const { mutate: userMutate } = useMutation({
        mutationKey: ['user'],
        mutationFn: async (data: CreateUserData) => createUser(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            return;
        },
    });

    const onHandleSubmit = async () => {
        await form.validateFields();
        await userMutate(form.getFieldsValue());
        form.resetFields();
        setDrawerOpen(false);
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace={true} />;
    }


    return (
        <>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Users' }]}
                />

                {isLoading && <div>Loading...</div>}
                {isError && <div>{error.message}</div>}

                <UsersFilter
                    onFillterChange={(filterName: string, filterValue: string) => {
                        console.log(filterName, filterValue);
                    }}
                >
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Add User
                    </Button>
                </UsersFilter>

                <Table
                    columns={columns}
                    dataSource={users?.data || []}
                    rowKey={'id'}
                    pagination={{
                        total: users?.total,
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
                    title="Create user"
                    width={720}
                    styles={{ body: { background: colorBgLayout } }}
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
                        <UserForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Users