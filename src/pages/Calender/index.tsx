import Calendar from "../../components/Calender";
import koKr from "antd/lib/calendar/locale/ko_KR";
import {
  Badge,
  Button,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Switch,
  Typography,
} from "antd";
import { FC, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Record from "../../components/Record";
import { DeleteOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { enableBodyScroll, disableBodyScroll } from "body-scroll-lock";

const CalenderPage = () => {
  const [date, setDate] = useState(dayjs());
  const [modal, setModal] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const onSelect = (date: dayjs.Dayjs) => {
    setDate(date);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const dateCellRender = (value: dayjs.Dayjs) => {
    const listData = [
      {
        type: "green",
        content: "234",
      },
      {
        type: "red",
        content: "q34q",
      },
      {
        type: "red",
        content: "23w4",
      },
    ];
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge color={item.type} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <div style={{ height: "calc(env(safe-area-inset-top) + 72px)" }}></div>
      <div className="top-navigation">
        <label style={{ margin: 0, display: "flex", alignItems: "center" }}>
          <input
            type="month"
            name="month"
            value={date.format("YYYY-MM")}
            onChange={({ target: { value } }) => setDate(dayjs(value))}
          />
          <DownOutlined style={{ marginLeft: "4px" }} />
        </label>
        <Button
          type="primary"
          onClick={() => {
            setModal(true);
          }}
        >
          <PlusOutlined />
        </Button>
      </div>
      <Calendar
        locale={koKr}
        value={date}
        headerRender={() => <></>}
        dateCellRender={dateCellRender}
        onSelect={onSelect}
      />
      <Divider />
      <Typography.Title
        level={4}
        style={{
          padding: "12px 20px 0",
          margin: 0,
        }}
      >
        {date.format("YYYY년 M월 D일")}
      </Typography.Title>
      <div
        style={{
          padding: 20,
          paddingBottom: "calc(env(safe-area-inset-bottom) + 80px)",
        }}
        ref={listRef}
      >
        <List
          itemLayout="horizontal"
          dataSource={["plus", "minus", "minus", "plus", "plus"] as "minus"[]}
          rowKey={(id) => id}
          renderItem={(item) => (
            <List.Item>
              <Record
                mode={item}
                title={"7,000원"}
                description={"떡볶이 먹음."}
              />
              <Popconfirm
                title="떡볶이 먹음.을 삭제할까요?"
                placement="left"
                okText="삭제"
                okButtonProps={{
                  danger: true,
                }}
                cancelText="취소"
              >
                <div role={"button"}>
                  <DeleteOutlined
                    style={{ fontSize: "16px", color: "#e1e1e1" }}
                  />
                </div>
              </Popconfirm>
            </List.Item>
          )}
        />
      </div>
      <RecordModal
        visible={modal}
        onClose={() => {
          setModal(false);
        }}
        target={date}
      />
    </div>
  );
};

export default CalenderPage;

const RecordModal: FC<{
  visible: boolean;
  onClose: () => any;
  target: dayjs.Dayjs;
}> = ({ visible, onClose, target }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (!visible && form) {
      form.resetFields();
    }
    if (visible) {
      const body = document.body;
      disableBodyScroll(body);
      return () => {
        enableBodyScroll(body);
      };
    }
  }, [visible]);
  return (
    <Modal
      title={`${target.format("M월 D일")} 내역 추가`}
      visible={visible}
      okText="저장"
      onOk={() => {
        form.submit();
      }}
      cancelText="취소"
      onCancel={onClose}
    >
      <Form
        layout="horizontal"
        form={form}
        onFinish={(form) => {
          console.log(form);
        }}
        initialValues={{
          type: false,
        }}
        requiredMark={false}
      >
        <Form.Item label="종류" name="type">
          <Switch
            className="record-type"
            checkedChildren="수입"
            unCheckedChildren="지출"
          />
        </Form.Item>
        <Form.Item
          label="금액"
          name="value"
          rules={[{ required: true, message: "반드시 입력해주세요." }]}
        >
          <Input inputMode="numeric" addonAfter="원" />
        </Form.Item>
        <Form.Item
          label="메모"
          name="memo"
          rules={[{ required: true, message: "반드시 입력해주세요." }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};
