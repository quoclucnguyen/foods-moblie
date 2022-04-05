import { Dialog, List, Toast } from 'antd-mobile'
import { AaOutline, RightOutline, UpCircleOutline } from 'antd-mobile-icons'
import axios from 'axios'
import React from 'react'
import { useAuth } from '../../App'

function Settings() {
    const auth = useAuth()
    return (
        <List style={{ width: '100% ' }} header='Settings'>
            <List.Item prefix={<RightOutline />}
                onClick={() => {
                    console.log('Logout')
                    Dialog.confirm({
                        title: `Logout`,
                        content: 'Are you sure to logout?',
                        confirmText: 'Logout',
                        cancelText: 'Cancel',
                        onConfirm: async () => {
                            const loadingToast = Toast.show({
                                icon: 'loading',
                                content: 'Logging out...',
                                duration: 0
                            })
                            const request = await axios.post(process.env.REACT_APP_DOMAIN + '/auth/logout', {}, {
                                headers: {
                                    'Authorization': `Bearer ${auth.user?.token}`
                                }
                            })
                            if (request) {
                                loadingToast.close()
                                if (request?.data?.logout) {
                                    auth.signout(() => { })
                                }

                            }
                        }
                    })
                }}
            >
                Logout</List.Item>
        </List>

    )
}

export default Settings