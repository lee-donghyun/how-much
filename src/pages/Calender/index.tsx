import Calendar from "../../components/Calender";
import koKr from "antd/lib/calendar/locale/ko_KR";
import {
  Badge,
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Popconfirm,
  Switch,
} from "antd";
import { FC, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import Record from "../../components/Record";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

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
        type: "green",
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
      <div className="top-navigation">
        <label>
          <input
            type="month"
            name="month"
            id="month"
            style={{ display: "none" }}
          />
          <button type="button" value={"month"}>
            {date.format("YYYY년 M월 D일")}
          </button>
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
        headerRender={() => <></>}
        dateCellRender={dateCellRender}
        onSelect={onSelect}
      />
      <Divider />
      <div style={{ padding: 20, paddingBottom: 80 }} ref={listRef}>
        <List
          itemLayout="horizontal"
          dataSource={[1, 2, 3, 4, 5]}
          rowKey={(id) => id}
          renderItem={(item) => (
            <List.Item>
              <Record
                mode="plus"
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
      />
    </div>
  );
};

export default CalenderPage;

const RecordModal: FC<{ visible: boolean; onClose: () => any }> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (!visible && form) {
      form.resetFields();
    }
  }, [visible]);
  return (
    <Modal
      title="내역 추가"
      visible={visible}
      okText="저장"
      onOk={() => {
        form.submit();
      }}
      cancelText="취소"
      onCancel={onClose}
    >
      <Form
        size="small"
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
            size="default"
            checkedChildren="수입"
            unCheckedChildren="지출"
          />
        </Form.Item>
        <Form.Item
          label="금액"
          name="value"
          rules={[{ required: true, message: "반드시 입력해주세요." }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `₩ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value?.replace(/\₩\s?|(,*)/g, "") ?? ""}
          />
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
