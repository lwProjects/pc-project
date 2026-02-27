import { Button, Space, Typography } from 'antd';

const { Title } = Typography;

function FormatTest() {
  const data = { name: 'test', age: 25, items: [1, 2, 3, 4, 5] };
  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <div>
      <Title level={2}>格式化测试</Title>
      <Space>
        <Button onClick={handleClick} type="primary">
          点击我
        </Button>
        <Button disabled>禁用按钮</Button>
      </Space>
      <div>
        {data.name}-{data.age}
      </div>
    </div>
  );
}

export default FormatTest;
