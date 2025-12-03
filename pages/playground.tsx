import Layout from '@/components/Layout'
import { ButtonPrimary } from '@/components/ButtonPrimary'
import { ButtonGold } from '@/components/ButtonGold'
import { ButtonGhost } from '@/components/ButtonGhost'
import { Input } from '@/components/Input'
import { Card } from '@/components/Card'
import Table from '@/components/Table'
import Badge from '@/components/Badge'
import AnalyticsCard from '@/components/AnalyticsCard'
import SpacingDemo from '@/components/SpacingDemo'

export default function Playground() {
    const tableData = [
        { id: 1, name: 'Campaign A', status: 'Active', clicks: 1250 },
        { id: 2, name: 'Campaign B', status: 'Paused', clicks: 850 },
        { id: 3, name: 'Campaign C', status: 'Draft', clicks: 0 },
    ]

    const columns = [
        { header: 'Name', accessor: 'name' as const },
        {
            header: 'Status',
            accessor: (item: any) => (
                <Badge variant={item.status === 'Active' ? 'success' : item.status === 'Paused' ? 'warning' : 'neutral'}>
                    {item.status}
                </Badge>
            )
        },
        { header: 'Clicks', accessor: 'clicks' as const },
    ]

    return (
        <Layout title="VAYRO UI Playground">
            <div className="space-y-12">
                <section>
                    <h2 className="text-3xl font-heading font-bold mb-6">UI Components</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card title="Buttons">
                            <div className="flex flex-wrap gap-4">
                                <ButtonPrimary>Primary Action</ButtonPrimary>
                                <ButtonGold>Gold Action</ButtonGold>
                                <ButtonGhost>Ghost Action</ButtonGhost>
                            </div>
                        </Card>

                        <Card title="Inputs">
                            <div className="space-y-4">
                                <Input label="Email Address" placeholder="name@example.com" />
                                <Input label="Error State" error="Invalid input" defaultValue="Wrong value" />
                            </div>
                        </Card>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Data Display</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <AnalyticsCard title="Total Clicks" value="24.5k" trend="+12%" trendUp={true} data={[40, 30, 60, 50, 80, 65, 90]} />
                        <AnalyticsCard title="Active Links" value="128" trend="+5%" trendUp={true} data={[20, 40, 30, 50, 40, 60, 70]} />
                        <AnalyticsCard title="Bounce Rate" value="42%" trend="-2%" trendUp={false} data={[60, 50, 70, 60, 50, 40, 30]} />
                    </div>

                    <Card title="Recent Campaigns">
                        <Table data={tableData} columns={columns} />
                    </Card>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">System</h2>
                    <Card>
                        <SpacingDemo />
                    </Card>
                </section>
            </div>
        </Layout>
    )
}
