"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Input, Rate, Row, Modal } from "antd";

interface IFormInput {
  orderNumber: string;
  rating: string;
  comment: string;
}
const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const RatingModal = (props: { rated: any; onClose: any; onSubmit: any }) => {
  const [form] = Form.useForm();
  const { rated, onClose, onSubmit } = props;
  // const [open, setOpen] = useState(false);
  const currentRate = Number(rated.rating);
  const [rating, setRating] = useState(currentRate);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (rated.rating !== rating) setRating(rated.rating);
    form.setFieldsValue({ comment: rated.comment });
  }, [rated.order]);
  
  const isRated = !!rated.comment && !!rated.rating;
  const closeModal = () => {
    form.resetFields();
    onClose();
  };
  const handleOk = () => {
    if (!isRated) {
      setConfirmLoading(true);
      const comment = form.getFieldValue("comment");
      onSubmit({ rating, comment });
      setConfirmLoading(false);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <Modal
        title="Please rate our service"
        open={rated.order?.length > 0 ? true : false}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={closeModal}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Rating">
            <span>
              <Rate
                tooltips={desc}
                onChange={setRating}
                value={rating}
                disabled={isRated}
              />
              {rating ? (
                <span className="ant-rate-text">{desc[rating - 1]}</span>
              ) : (
                ""
              )}
            </span>
          </Form.Item>
          <Form.Item label="Comment" name="comment">
            <Input readOnly={isRated} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export { RatingModal };
