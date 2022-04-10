import Calendar from "../../components/Calender";
import koKr from "antd/lib/calendar/locale/ko_KR";
import {
  Badge,
  Button,
  Divider,
  Form,
  Input,
  List,
  message,
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
import db from "../../services/api/db";
import { useLiveQuery } from "dexie-react-hooks";

const CalenderPage = () => {
  const [date, setDate] = useState(dayjs());
  const [modal, setModal] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const records = useLiveQuery(
    () =>
      db.records
        .where("unix")
        .between(
          date.clone().startOf("month").unix(),
          date.clone().add(1, "month").startOf("month").unix()
        )
        .toArray(),
    [date]
  );

  const onSelect = (date: dayjs.Dayjs) => {
    setDate(date);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const dateCellRender = (value: dayjs.Dayjs) => {
    const listData =
      records?.filter((record) =>
        dayjs(record.unix * 1000).isSame(value, "date")
      ) ?? [];
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id ?? ""}>
            <Badge color={typeColor[item.type]} />
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
          dataSource={
            records?.filter((record) =>
              dayjs(record.unix * 1000).isSame(date, "date")
            ) ?? []
          }
          rowKey={(record) => record.id ?? ""}
          renderItem={(record) => (
            <List.Item>
              <Record
                mode={record.type}
                title={`${record.value.toLocaleString()}원`}
                description={record.description}
              />
              <Popconfirm
                title={`${record.description}을 삭제할까요?`}
                placement="left"
                okText="삭제"
                okButtonProps={{
                  danger: true,
                }}
                cancelText="취소"
                onConfirm={async () => {
                  try {
                    if (!record.id) {
                      throw new Error("");
                    }
                    await db.records.delete(record.id);
                  } catch (error) {
                    message.error("다시 시도해주세요.");
                    console.error(error);
                  }
                }}
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
        onFinish={async (form) => {
          const value = Number(form.value);
          if (Number.isNaN(value)) {
            return message.error("반드시 숫자로 입력해주세요.");
          }
          try {
            await db.records.add({
              unix: target.unix(),
              value,
              description: form.description,
              type: form.type ? "plus" : "minus",
            });
            onClose();
            message.success("저장되었습니다.");
          } catch (error) {
            message.error("다시 시도해주세요.");
          }
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
          name="description"
          rules={[{ required: true, message: "반드시 입력해주세요." }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const typeColor = {
  plus: "green",
  minus: "red",
};
