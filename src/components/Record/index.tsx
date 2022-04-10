import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";

const Record = ({
  mode,
  title,
  description,
}: {
  mode: "plus" | "minus";
  title: string;
  description: string;
}) => {
  return (
    <List.Item.Meta
      avatar={
        <Avatar
          icon={mode == "plus" ? <PlusOutlined /> : <MinusOutlined />}
          style={{
            backgroundColor: mode == "plus" ? "#f6ffed" : "#fff1f0",
            color: mode == "plus" ? "#389e0d" : "#cf1322",
            borderColor: mode == "plus" ? "#b7eb8f" : "#ffa39e",
            borderWidth: "1px",
            borderStyle: "solid",
            width: "33px",
            height: "33px",
          }}
        />
      }
      title={title}
      description={description}
    />
  );
};

export default Record;
