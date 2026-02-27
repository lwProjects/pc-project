/*
 * @Author: liuwei2783
 * @Description:
 * @FilePath: \src\I18nPage.tsx
 */
import { Typography } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import './App.css';
import { useLocale } from './locales/LocaleContext';
import TableDemo from './TableDemo';

const { Title, Paragraph } = Typography;

const I18nPage: React.FC = () => {
  const intl = useIntl();
  const { locale, setLocale } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLocaleChange = (e: any) => {
    setLocale(e.target.value);
  };

  return (
    <div className="App">
      {/* <div className="container">
        <Card>
          <Title level={2}>
            <FormattedDate
              value={new Date('2024-11-24')}
              year="numeric"
              month="long"
              day="numeric"
            />
            <FormattedMessage id="app.title" />
          </Title>

          <Paragraph>
            <FormattedMessage id="app.description" />
          </Paragraph>

          <Divider />

          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio.Group onChange={handleLocaleChange} value={locale}>
              <Radio.Button value="zh-CN">
                <FormattedMessage id="app.chinese" />
              </Radio.Button>
              <Radio.Button value="en-US">
                <FormattedMessage id="app.english" />
              </Radio.Button>
            </Radio.Group>

            <Divider />

            <Space>
              <Button type="primary">
                <FormattedMessage id="app.button.primary" />
              </Button>
              <Button>
                <FormattedMessage id="app.button.default" />
              </Button>
              <Button type="dashed">
                <FormattedMessage id="app.button.dashed" />
              </Button>
              <Button onClick={showModal}>
                <FormattedMessage id="app.modal.title" />
              </Button>
            </Space>
          </Space>
        </Card>

        <Modal
          title={intl.formatMessage({ id: 'app.modal.title' })}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={intl.formatMessage({ id: 'app.modal.okText' })}
          cancelText={intl.formatMessage({ id: 'app.modal.cancelText' })}
        >
          <p>
            <FormattedMessage id="app.modal.content" />
          </p>
        </Modal>
      </div> */}
      <TableDemo />
    </div>
  );
};

export default I18nPage;
