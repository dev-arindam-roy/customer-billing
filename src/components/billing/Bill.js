import React, { useState, useEffect, useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toWords } from "number-to-words";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Logo from "../../assets/logo.png";
import {
  FiLogOut,
  FiArchive,
  FiFilePlus,
  FiPlusSquare,
  FiFileText,
  FiLogIn,
  FiInfo,
  FiUser,
  FiUserCheck,
  FiUserPlus,
  FiEdit,
  FiSave,
  FiPrinter,
  FiX,
  FiChevronsRight,
} from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./Bill.css";

const initBillObj = {
  items: [
    {
      name: "",
      qty: "",
      price: "",
      total: "",
      hsn: "",
      batch: "",
      expiry: "",
      expiryMonth: "",
      gst: "",
      tax: "",
    },
    {
      name: "",
      qty: "",
      price: "",
      total: "",
      hsn: "",
      batch: "",
      expiry: "",
      expiryMonth: "",
      gst: "",
      tax: "",
    },
  ],
  discount: "",
  payable_amount: "",
  sub_total: "",
  total_gst: "",
  cgst: "",
  sgst: "",
};

const resetInitBillObj = {
  items: [
    {
      name: "",
      qty: "",
      price: "",
      total: "",
      hsn: "",
      batch: "",
      expiry: "",
      expiryMonth: "",
      gst: "",
      tax: "",
    },
    {
      name: "",
      qty: "",
      price: "",
      total: "",
      hsn: "",
      batch: "",
      expiry: "",
      expiryMonth: "",
      gst: "",
      tax: "",
    },
  ],
  discount: "",
  payable_amount: "",
  sub_total: "",
  total_gst: "",
  cgst: "",
  sgst: "",
};

const initBillerInfo = {
  name: "",
  email: "",
  phno: "",
  address: "",
  gst_no: "",
  dl_no: "",
};

const initCustomerInfo = {
  name: "",
  email: "",
  phno: "",
  address: "",
  bill_date: "",
  doctorName: "",
};

const today = new Date();
const minDate = new Date(today.getFullYear() - 3, today.getMonth());
const maxDate = new Date(today.getFullYear() + 5, today.getMonth());
const minMonth = minDate.toISOString().slice(0, 7);
const maxMonth = maxDate.toISOString().slice(0, 7);
// console.log(minMonth, maxMonth);

const Bill = () => {
  const [bill, setBill] = useState(initBillObj);
  const [isBillModalShow, setIsBillModalShow] = useState(false);
  const [isLoginModalShow, setIsLoginModalShow] = useState(true);
  const [isBillerModalShow, setIsBillerModalShow] = useState(false);
  const [isCustomerModalShow, setIsCustomerModalShow] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authUsername, setAuthUsername] = useState(
    process.env.REACT_APP_USERNAME
  );
  const [authPassword, setAuthPassword] = useState(
    process.env.REACT_APP_PASSWORD
  );
  const [billerInfo, setBillerInfo] = useState(initBillerInfo);
  const [customerInfo, setCustomerInfo] = useState(initCustomerInfo);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const checkAuth = () => {
    let isAuth = localStorage.getItem("GIT_JUST_BILLING_AUTH") || null;
    if (isAuth) {
      let authName =
        localStorage.getItem("GIT_JUST_BILLING_AUTH_NAME") || "User";
      setIsLoginModalShow(false);
      setAuthName(authName);
    } else {
      setIsLoginModalShow(true);
    }
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    setAuthName("");
    localStorage.setItem("GIT_JUST_BILLING_AUTH", null);
    localStorage.setItem("GIT_JUST_BILLING_AUTH_NAME", null);
    localStorage.setItem("GIT_JUST_BILLING_BILLER_INFO", null);
    localStorage.removeItem("GIT_JUST_BILLING_AUTH");
    localStorage.removeItem("GIT_JUST_BILLING_AUTH_NAME");
    localStorage.removeItem("GIT_JUST_BILLING_BILLER_INFO");
    setCustomerInfo(initCustomerInfo);
    setBillerInfo(initBillerInfo);
    setBill(resetInitBillObj);
    setIsLoginModalShow(true);
    toast.success("You have sign-out successfully!");
  };

  useEffect(() => {
    checkAuth();
  }, [isLoginModalShow]);

  const signInButtonHandler = () => {
    document.getElementById("signInFormHiddenSubmitBtn").click();
  };

  const signinFormHandler = (e) => {
    e.preventDefault();
    if (
      authUsername === process.env.REACT_APP_USERNAME &&
      authPassword === process.env.REACT_APP_PASSWORD
    ) {
      localStorage.setItem("GIT_JUST_BILLING_AUTH", true);
      localStorage.setItem("GIT_JUST_BILLING_AUTH_NAME", authName);
      setIsLoginModalShow(false);
      toast.success(`Hi! Welcome to account ${authName}`);
    } else {
      localStorage.setItem("GIT_JUST_BILLING_AUTH", null);
      localStorage.setItem("GIT_JUST_BILLING_AUTH_NAME", null);
      localStorage.removeItem("GIT_JUST_BILLING_AUTH");
      localStorage.removeItem("GIT_JUST_BILLING_AUTH_NAME");
      setIsLoginModalShow(true);
      toast.error("Sorry! Username and Password is wrong");
    }
  };

  const cancelBillingHandler = () => {
    setBill(resetInitBillObj);
    setCustomerInfo(initCustomerInfo);
  };

  const onChangeItemNameHandler = (evt, index) => {
    let _billItems = [...bill.items];
    _billItems[index].name = evt.target.value;
    setBill({ ...bill, items: _billItems });
  };

  const onChangeItemHsnCodeHandler = (evt, index) => {
    let _billItems = [...bill.items];
    _billItems[index].hsn = evt.target.value;
    setBill({ ...bill, items: _billItems });
  };

  const onChangeItemBatchNoHandler = (evt, index) => {
    let _billItems = [...bill.items];
    _billItems[index].batch = evt.target.value;
    setBill({ ...bill, items: _billItems });
  };

  const onChangeItemExpiryDateHandler = (evt, index) => {
    let _billItems = [...bill.items];
    let _value = evt.target.value;
    const [_year, _month] = _value.split("-");
    const _date = new Date(_year, _month - 1);
    const _formattedMonth = _date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    _billItems[index].expiry = _value;
    _billItems[index].expiryMonth = _formattedMonth;
    setBill({ ...bill, items: _billItems });
  };

  const onChangeItemGstHandler = (evt, index) => {
    let _billItems = [...bill.items];
    const _gst = parseFloat(evt.target.value);
    const _qty = parseFloat(_billItems[index].qty) || 0;
    const _price = parseFloat(_billItems[index].price) || 0;
    const _total = _price * _qty;
    _billItems[index].gst = _gst;
    _billItems[index].total = _total.toFixed(2);
    //_billItems[index].tax = ((_price - ((_price * _gst) / 100)) * _qty).toFixed(2);
    _billItems[index].tax = ((_price / (1 + _gst / 100)) * _qty).toFixed(2);
    setBill({ ...bill, items: _billItems });
    calculateTotalPayableAmount();
  };

  const onChangeItemQtyHandler = (evt, index) => {
    let _billItems = [...bill.items];
    const _qty = parseFloat(evt.target.value);
    const _price = parseFloat(_billItems[index].price) || 0;
    const _gst = parseFloat(_billItems[index].gst) || 0;
    const _total = _price * _qty;
    _billItems[index].qty = _qty;
    _billItems[index].total = _total.toFixed(2);
    //_billItems[index].tax = ((_price - ((_price * _gst) / 100)) * _qty).toFixed(2);
    _billItems[index].tax = ((_price / (1 + _gst / 100)) * _qty).toFixed(2);
    setBill({ ...bill, items: _billItems });
    calculateTotalPayableAmount();
  };

  const onChangeItemPriceHandler = (evt, index) => {
    let _billItems = [...bill.items];
    const _price = parseFloat(evt.target.value);
    const _qty = parseFloat(_billItems[index].qty) || 0;
    const _gst = parseFloat(_billItems[index].gst) || 0;
    const _total =
      _price * _qty + (_gst && _gst > 0 ? (_price * _qty * _gst) / 100 : 0);
    _billItems[index].price = _price;
    _billItems[index].total = _total.toFixed(2);
    _billItems[index].tax = (_price * _qty).toFixed(2);
    setBill({ ...bill, items: _billItems });
    calculateTotalPayableAmount();
  };

  const addMoreItemRowHandler = () => {
    setBill({
      ...bill,
      items: [...bill.items, { name: "", qty: "", price: "", total: "" }],
    });
  };

  const removeItemRowHandler = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        let _billItems = [...bill.items];
        _billItems.splice(index, 1);
        setBill({ ...bill, items: _billItems });
        calculateTotalPayableAmount();
      }
    });
  };

  const billDiscountHandler = (e) => {
    const discount = parseFloat(e.target.value);
    setBill((prevBill) => ({
      ...prevBill,
      discount: discount,
    }));
  };

  const calculateTotalPayableAmount = useCallback(() => {
    let _payableAmount = 0;
    let _discount = parseFloat(bill.discount) || 0;
    let _subTotal = 0;
    let _totalGst = 0;
    let _eachGst = 0;

    if (bill.items.length > 0) {
      bill.items.forEach((item) => {
        let total = parseFloat(item.total) || 0;
        let taxable = parseFloat(item.tax) || 0;
        _payableAmount += total;
        _subTotal += taxable;
      });
    }

    _payableAmount -= _discount;
    if (_subTotal > 0) {
      _totalGst = _payableAmount - _subTotal;
    }
    if (_totalGst > 0) {
      _eachGst = _totalGst / 2;
    }
    setBill((prevBill) => ({
      ...prevBill,
      payable_amount: _payableAmount.toFixed(2),
      sub_total: _subTotal.toFixed(2),
      total_gst: _totalGst.toFixed(2),
      cgst: _eachGst.toFixed(2),
      sgst: _eachGst.toFixed(2),
    }));
  }, [bill.items, bill.discount]);

  useEffect(() => {
    calculateTotalPayableAmount();
  }, [bill.items, bill.discount, calculateTotalPayableAmount]);

  const formSubmitButtonHandler = () => {
    document.getElementById("formHiddenSubmitBtn").click();
  };

  const itemCollectionFrmSubmitHandler = (e) => {
    e.preventDefault();
    if (customerInfo.name === "" || customerInfo.phno === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Customer Information Not Set",
        footer: "Please add the customer information and proceed",
        confirmButtonColor: "#0d6efd",
      });
    } else if (billerInfo.name === "" || billerInfo.phno === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Biller Information Not Set",
        footer: "Please add the biller information and proceed",
        confirmButtonColor: "#0d6efd",
      });
    } else {
      Swal.fire({
        title: "Please wait...",
        html: "System is <strong>processing</strong> your request",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        Swal.close();
        setIsBillModalShow(true);
        toast.success("Bill has been generated successfully!");
      });
    }
  };

  const billModalCloseHandler = () => {
    setIsBillModalShow(false);
  };

  const nextBillProceedHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed for next billing?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        setCustomerInfo(initCustomerInfo);
        setBill(resetInitBillObj);
        setIsBillModalShow(false);
      }
    });
  };

  /** Biller Modal */
  const billerInfonButtonHandler = () => {
    document.getElementById("billerInfoFormHiddenSubmitBtn").click();
  };

  const billerModalCloseHandler = () => {
    setIsBillerModalShow(false);
  };

  const showBillerInfoModal = () => {
    setIsBillerModalShow(true);
  };

  const billerFormSubmitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem(
      "GIT_JUST_BILLING_BILLER_INFO",
      JSON.stringify(billerInfo)
    );
    setIsBillerModalShow(false);
  };

  useEffect(() => {
    let billerInfo =
      JSON.parse(localStorage.getItem("GIT_JUST_BILLING_BILLER_INFO")) ||
      initBillerInfo;
    setBillerInfo(billerInfo);
  }, []);

  /** Customer Modal */
  const customerInfonButtonHandler = () => {
    document.getElementById("customerInfoFormHiddenSubmitBtn").click();
  };

  const customerModalCloseHandler = () => {
    setIsCustomerModalShow(false);
  };

  const showCustomerInfoModal = () => {
    setIsCustomerModalShow(true);
  };

  const customerFormSubmitHandler = (e) => {
    e.preventDefault();
    setIsCustomerModalShow(false);
  };

  const convertToWords = (num) => {
    if (!num) return "";

    const [integerPart, decimalPart] = num.toString().split(".");

    let words = toWords(parseInt(integerPart));

    if (decimalPart && parseFloat(decimalPart) > 0) {
      words += " point";
      for (let digit of decimalPart) {
        words += " " + toWords(parseInt(digit));
      }
    }

    return words + " rupees.";
  };

  return (
    <>
      <Container fluid>
        <Row className="mt-5">
          <Col xs={12} sm={12} md={4}>
            <h1>
              <FiArchive className="icon-adjust-10 text-primary mx-2" />
              <strong>Just Billing</strong>
            </h1>
          </Col>
          <Col xs={12} sm={12} md={8} className="onex-text-content-right-align">
            {!isLoginModalShow && (
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <FiUser className="icon-adjust-2" /> Hello{" "}
                  {authName || "User"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href="#/billing-info"
                    onClick={showBillerInfoModal}
                  >
                    <FiInfo className="icon-adjust-2" /> Biller Info
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#/logout" onClick={logoutHandler}>
                    <FiLogOut className="icon-adjust-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12} sm={12} md={5}>
            <Card>
              <Card.Header>
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <FiUserCheck className="icon-adjust-2" />{" "}
                    <strong>Biller Information</strong>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={6}
                    className="onex-text-content-right-align"
                  >
                    <FiEdit
                      className="icon-adjust-2 mouse-hover"
                      onClick={showBillerInfoModal}
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Table size="sm">
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>{billerInfo.name || "---"}</td>
                    </tr>
                    <tr>
                      <th>Email:</th>
                      <td>{billerInfo.email || "---"}</td>
                    </tr>
                    <tr>
                      <th>Phone:</th>
                      <td>{billerInfo.phno || "---"}</td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>{billerInfo.address || "---"}</td>
                    </tr>
                    <tr>
                      <th>GST No:</th>
                      <td>{billerInfo.gst_no || "---"}</td>
                    </tr>
                    <tr>
                      <th>D.L No:</th>
                      <td>{billerInfo.dl_no || "---"}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={2}></Col>
          <Col xs={12} sm={12} md={5}>
            <Card>
              <Card.Header>
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <FiUserPlus className="icon-adjust-2" />{" "}
                    <strong>Customer Information</strong>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={6}
                    className="onex-text-content-right-align"
                  >
                    <FiEdit
                      className="icon-adjust-2 mouse-hover"
                      onClick={showCustomerInfoModal}
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Table size="sm">
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>{customerInfo.name || "---"}</td>
                    </tr>
                    <tr>
                      <th>Email:</th>
                      <td>{customerInfo.email || "---"}</td>
                    </tr>
                    <tr>
                      <th>Phone:</th>
                      <td>{customerInfo.phno || "---"}</td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>{customerInfo.address || "---"}</td>
                    </tr>
                    <tr>
                      <th>Doctor Name:</th>
                      <td>{customerInfo.doctorName || "---"}</td>
                    </tr>
                    <tr>
                      <th>Date:</th>
                      <td>
                        {customerInfo.bill_date
                          ? new Date(customerInfo.bill_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "---"}
                      </td>
                    </tr>
                    {/*
                    <tr>
                      <th>Date:</th>
                      <td>
                        {new Date()
                          .toLocaleDateString('en-GB')
                          .replace(/\//g, '/')}
                      </td>
                    </tr>
                    */}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-2 mb-5">
          <Col xs={12} sm={12} md={12}>
            <Card>
              <Card.Header>
                <Row>
                  <Col xs={12} sm={12} md={4}>
                    <FiFilePlus className="icon-adjust-2" />{" "}
                    <strong>Create New Bill</strong>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={8}
                    className="onex-text-content-right-align"
                  >
                    <span>
                      <strong>Total Items: {bill.items.length}</strong>
                    </span>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={itemCollectionFrmSubmitHandler}>
                  {bill.items.length > 0 &&
                    bill.items.map((item, index) => {
                      return (
                        <Row key={"billItemRow-" + index}>
                          <Col xs={12} sm={12} md={2}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemName-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Product Name:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="text"
                                name={"bill_item_name[" + index + "]"}
                                value={item.name}
                                placeholder="Enter Item"
                                required
                                onChange={(e) =>
                                  onChangeItemNameHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={1}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemQty-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Quantity:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="number"
                                name={"bill_item_qty[" + index + "]"}
                                value={item.qty}
                                min={1}
                                placeholder="QTY"
                                required
                                onChange={(e) =>
                                  onChangeItemQtyHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={1}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemHsnCode-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>HSN Code:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="text"
                                name={"bill_hsn_code[" + index + "]"}
                                value={item.hsn}
                                placeholder="HSN"
                                required
                                onChange={(e) =>
                                  onChangeItemHsnCodeHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={1}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemBatchNo-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Batch No:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="text"
                                name={"bill_batch_no[" + index + "]"}
                                value={item.batch}
                                placeholder="Batch No"
                                required
                                onChange={(e) =>
                                  onChangeItemBatchNoHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemExpiryDate-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Expiry Date:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="month"
                                name={"bill_expiry_date[" + index + "]"}
                                value={item.expiry}
                                placeholder="Expity Date"
                                min={minMonth}
                                max={maxMonth}
                                required
                                onChange={(e) =>
                                  onChangeItemExpiryDateHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={1}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemPrice-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>MRP:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="number"
                                name={"bill_item_price[" + index + "]"}
                                value={item.price}
                                min={0.01}
                                step={0.01}
                                placeholder="Price"
                                required
                                onChange={(e) =>
                                  onChangeItemPriceHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={1}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemGst-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>GST(%):</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="number"
                                name={"bill_item_gst[" + index + "]"}
                                value={item.gst}
                                min={0.01}
                                step={0.01}
                                placeholder="GST"
                                required
                                onChange={(e) =>
                                  onChangeItemGstHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={1}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemTax-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Taxable:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="number"
                                name={"bill_item_tax[" + index + "]"}
                                value={item.tax}
                                min={0.01}
                                step={0.01}
                                placeholder="Taxable"
                                disabled
                                readOnly
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={1}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemAmount-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Total:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="number"
                                name={"bill_item_total[" + index + "]"}
                                value={item.total}
                                min={0.01}
                                step={0.01}
                                placeholder="Total"
                                disabled
                                readOnly
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={1}>
                            {index > 0 && (
                              <MdDelete
                                className="row-delete-icon-adjust text-danger"
                                onClick={() => removeItemRowHandler(index)}
                              />
                            )}
                          </Col>
                        </Row>
                      );
                    })}
                  <Row>
                    <Col xs={12} sm={12} md={7}></Col>
                    <Col xs={12} sm={12} md={2} style={{ textAlign: "right" }}>
                      <strong>Sub Total:</strong>
                    </Col>
                    <Col xs={12} sm={12} md={1}>
                      <Form.Group className="mb-3" controlId="subTotal">
                        <Form.Control
                          type="number"
                          name="sub_total"
                          value={bill.sub_total || "0"}
                          min={1}
                          placeholder="Sub Total"
                          disabled
                          readOnly
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={1}>
                      <Form.Group className="mb-3" controlId="payableAmount">
                        <Form.Control
                          type="number"
                          name="payable_amount"
                          value={bill.payable_amount || "0"}
                          min={1}
                          placeholder="Payable Amount"
                          disabled
                          readOnly
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={12} md={7}></Col>
                    <Col xs={12} sm={12} md={2} style={{ textAlign: "right" }}>
                      <strong>Total GST:</strong>
                    </Col>
                    <Col xs={12} sm={12} md={2}>
                      <Form.Group className="mb-3" controlId="totalGst">
                        <Form.Control
                          type="number"
                          name="total_gst"
                          value={bill.total_gst || "0"}
                          min={1}
                          placeholder="Total GST"
                          disabled
                          readOnly
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={12} md={7}></Col>
                    <Col xs={12} sm={12} md={2} style={{ textAlign: "right" }}>
                      <strong>CGST:</strong>
                    </Col>
                    <Col xs={12} sm={12} md={2}>
                      <Form.Group className="mb-3" controlId="cgst">
                        <Form.Control
                          type="number"
                          name="cgst"
                          value={bill.cgst || "0"}
                          min={1}
                          placeholder="CGST"
                          disabled
                          readOnly
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} sm={12} md={7}></Col>
                    <Col xs={12} sm={12} md={2} style={{ textAlign: "right" }}>
                      <strong>SGST:</strong>
                    </Col>
                    <Col xs={12} sm={12} md={2}>
                      <Form.Group className="mb-3" controlId="sgst">
                        <Form.Control
                          type="number"
                          name="sgst"
                          value={bill.sgst || "0"}
                          min={1}
                          placeholder="SGST"
                          disabled
                          readOnly
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {/**
                  <Row>
                    <Col xs={12} sm={12} md={7}></Col>
                    <Col xs={12} sm={12} md={2} style={{ textAlign: 'right' }}>
                      <strong>Discount:</strong>
                    </Col>
                    <Col xs={12} sm={12} md={2}>
                      <Form.Group className='mb-3' controlId='billDiscount'>
                        <Form.Control
                          type='number'
                          name='bill_discount'
                          min={0}
                          placeholder='Discount'
                          value={bill.discount}
                          onChange={billDiscountHandler}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  **/}
                  <Row>
                    <Col xs={12} sm={12} md={7}></Col>
                    <Col xs={12} sm={12} md={2} style={{ textAlign: "right" }}>
                      <strong>Net Amount:</strong>
                    </Col>
                    <Col xs={12} sm={12} md={2}>
                      <Form.Group className="mb-3" controlId="netPayableAmount">
                        <Form.Control
                          type="number"
                          name="payable_amount"
                          value={bill.payable_amount || "0"}
                          min={1}
                          placeholder="Payable Amount"
                          disabled
                          readOnly
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    type="submit"
                    id="formHiddenSubmitBtn"
                    variant="secondary"
                    className="d-none"
                  >
                    Submit
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <Button variant="primary" onClick={addMoreItemRowHandler}>
                      <FiPlusSquare className="icon-adjust-2" /> Add More Item
                    </Button>{" "}
                    <Button variant="success" onClick={formSubmitButtonHandler}>
                      <FiFileText className="icon-adjust-2" /> Generate Bill
                    </Button>{" "}
                    {customerInfo.name !== "" && (
                      <Button variant="danger" onClick={cancelBillingHandler}>
                        <FiFileText className="icon-adjust-2" /> Cancel Bill
                      </Button>
                    )}
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={6}
                    className="onex-text-content-right-align"
                  >
                    <span>
                      <strong>
                        Total Payable Amount: {bill.payable_amount || "0"}
                      </strong>
                    </span>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5 mb-2">
          <Col md={12}>
            <p style={{ textAlign: "center", color: "#ccc", fontSize: "14px" }}>
              Sponsored By: Arindam Roy | 9836395513
            </p>
          </Col>
        </Row>
      </Container>

      {/* Generate Bill Modal */}
      <Modal
        backdrop="static"
        keyboard={false}
        show={isBillModalShow}
        onHide={billModalCloseHandler}
        size="xl"
        centered
        scrollable
      >
        <Modal.Body>
          <div ref={printRef} style={{ marginTop: "20px", padding: "15px" }}>
            <div className="client-logo-box">
              <img src={Logo} className="client-logo" alt="client-logo" />
            </div>
            <Row className="bill-print-header">
              <Col xs={12} sm={12} md={6} style={{ width: "50%" }}>
                <p>
                  <span className="bill-name">
                    <strong>{billerInfo.name}</strong>
                  </span>
                </p>
                <p>
                  <span className="bill-address">
                    <strong>Address:</strong> {billerInfo.address}
                  </span>
                </p>
                {billerInfo.gst_no !== "" && (
                  <p>
                    <span className="bill-gst">
                      <strong>GST No:</strong> {billerInfo.gst_no}
                    </span>
                  </p>
                )}
                {billerInfo.dl_no !== "" && (
                  <p>
                    <span className="bill-gst">
                      <strong>D.L No:</strong> {billerInfo.dl_no}
                    </span>
                  </p>
                )}
              </Col>
              <Col
                xs={12}
                sm={12}
                md={6}
                className="onex-text-content-right-align"
                style={{ width: "50%" }}
              >
                <p>
                  <span className="bill-phno">
                    <strong>Phone No:</strong> {billerInfo.phno}
                  </span>{" "}
                </p>
                <p>
                  {billerInfo.email !== "" && (
                    <span className="bill-email">
                      <strong>Email Id:</strong> {billerInfo.email}
                    </span>
                  )}
                </p>
              </Col>
            </Row>
            <hr />
            <Row className="bill-print-header">
              <Col md={6} style={{ width: "50%" }}>
                <p>
                  <span className="bill-name">
                    <strong>{customerInfo.name}</strong>
                  </span>
                </p>
                <p>
                  <span className="bill-phno">
                    <strong>Mobile No:</strong> {customerInfo.phno}
                  </span>{" "}
                </p>
                {customerInfo.email !== "" && (
                  <p>
                    <span className="bill-email">
                      <strong>Email:</strong> {customerInfo.email}
                    </span>
                  </p>
                )}
                {customerInfo.address !== "" && (
                  <p>
                    <span className="bill-address">
                      <strong>Address:</strong> {customerInfo.address}
                    </span>
                  </p>
                )}
                {customerInfo.doctorName !== "" && (
                  <p>
                    <span className="bill-address">
                      <strong>Doctor:</strong> {customerInfo.doctorName}
                    </span>
                  </p>
                )}
              </Col>
              <Col
                md={6}
                className="onex-text-content-right-align"
                style={{ width: "50%" }}
              >
                <p>
                  <strong>Invoice No:</strong>{" "}
                  {Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {customerInfo.bill_date
                    ? new Date(customerInfo.bill_date).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "2-digit", year: "numeric" }
                      )
                    : new Date()
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "/")}
                </p>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Table
                  striped
                  bordered
                  hover
                  size="sm"
                  style={{ width: "100%" }}
                >
                  <thead className="bill-print-thead">
                    <tr>
                      <th colSpan={10} style={{ backgroundColor: "#ddd" }}>
                        Bill Items
                      </th>
                    </tr>
                    <tr>
                      <th>SL.</th>
                      <th>Items</th>
                      <th>QTY</th>
                      <th>HSN</th>
                      <th>Batch No</th>
                      <th>Expiry Date</th>
                      <th>MRP</th>
                      <th>GST(%)</th>
                      <th>Taxable</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody className="bill-print-tbody">
                    {bill.items.length > 0 &&
                      bill.items.map((item, index) => {
                        return (
                          <tr key={"bill-item-tabrow" + index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.qty}</td>
                            <td>{item.hsn}</td>
                            <td>{item.batch}</td>
                            <td>{item.expiryMonth}</td>
                            <td>{parseFloat(item.price).toFixed(2)}</td>
                            <td>{item.gst !== "" ? item.gst + "%" : ""}</td>
                            <td>{item.tax}</td>
                            <td>{item.total}</td>
                          </tr>
                        );
                      })}
                    <tr>
                      <th colSpan={8} style={{ textAlign: "right" }}>
                        SUB TOTAL
                      </th>
                      <td>
                        {bill.sub_total
                          ? parseFloat(bill.sub_total).toFixed(2) || "0.00"
                          : "0.00"}
                      </td>
                      <td>{bill.payable_amount || "0.00"}</td>
                    </tr>
                    <tr>
                      <th colSpan={8} style={{ textAlign: "right" }}>
                        TOTAL GST TAKEN
                      </th>
                      <td colSpan={2}>
                        {bill.total_gst
                          ? parseFloat(bill.total_gst).toFixed(2) || "0.00"
                          : "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={8} style={{ textAlign: "right" }}>
                        CGST
                      </th>
                      <td colSpan={2}>
                        {bill.sgst
                          ? parseFloat(bill.cgst).toFixed(2) || "0.00"
                          : "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={8} style={{ textAlign: "right" }}>
                        SGST
                      </th>
                      <td colSpan={2}>
                        {bill.cgst
                          ? parseFloat(bill.sgst).toFixed(2) || "0.00"
                          : "0.00"}
                      </td>
                    </tr>
                    {/**
                    <tr>
                      <th colSpan={9} style={{ textAlign: 'right' }}>
                        Discount
                      </th>
                      <td>
                        {bill.discount
                          ? parseFloat(bill.discount).toFixed(2) || '0.00'
                          : '0.00'}
                      </td>
                    </tr>
                    **/}
                    <tr>
                      <th colSpan={8} style={{ textAlign: "right" }}>
                        TOTAL PAYABLE AMOUNT
                      </th>
                      <td colSpan={2}>{bill.payable_amount || "0.00"}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bill-print-tfoot">
                    <tr>
                      <th colSpan={10}>
                        <span style={{ color: "#ccc" }}>In Words:</span> <br />{" "}
                        <span className="number-text">
                          {convertToWords(bill.payable_amount || "0.00")}
                        </span>
                      </th>
                    </tr>
                    <tr>
                      <th
                        colSpan={10}
                        style={{ textAlign: "right", backgroundColor: "#ccc" }}
                      >
                        Thank You!
                      </th>
                    </tr>
                  </tfoot>
                </Table>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <strong>⁠N.B:-</strong> GOODS ONCE SOLD WILL NOT BE TAKEN BACK
                OR REPLACED.
              </Col>
            </Row>
            <Row style={{ marginTop: "100px" }}>
              <Col md={6}>CHECKEDBY</Col>
              <Col md={6} className="text-end">
                SIGNATURE
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={billModalCloseHandler}>
            <FiX className="icon-adjust-4" /> Close
          </Button>
          <Button variant="primary" onClick={nextBillProceedHandler}>
            <FiChevronsRight className="icon-adjust-4" /> Next Bill
          </Button>
          <Button variant="success" onClick={handlePrint}>
            <FiPrinter className="icon-adjust-4" /> Print Bill
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Auth Login Modal */}
      <Modal
        backdrop="static"
        keyboard={false}
        show={isLoginModalShow}
        dialogClassName="blur-backdrop"
        centered
        scrollable
      >
        <Modal.Header>
          <Modal.Title>
            <FiLogIn className="icon-adjust-2" /> Sign-In
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={signinFormHandler}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="authName">
                  <Form.Control
                    type="text"
                    name="auth_name"
                    placeholder="Your Name"
                    value={authName}
                    required
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="authUserName">
                  <Form.Control
                    type="text"
                    name="auth_username"
                    placeholder="Username"
                    value={authUsername}
                    required
                    onChange={(e) => setAuthUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="authPassword">
                  <Form.Control
                    type="password"
                    name="auth_password"
                    placeholder="Password"
                    value={authPassword}
                    required
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              id="signInFormHiddenSubmitBtn"
              variant="secondary"
              className="d-none"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={signInButtonHandler}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Biller Information Modal */}
      <Modal
        backdrop="static"
        keyboard={false}
        show={isBillerModalShow}
        onHide={billerModalCloseHandler}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiUserCheck className="icon-adjust-2" /> Biller Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={billerFormSubmitHandler}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="billerName">
                  <Form.Control
                    type="text"
                    name="biller_name"
                    placeholder="Biller Name"
                    value={billerInfo.name}
                    required
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, name: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="billerEmail">
                  <Form.Control
                    type="email"
                    name="biller_email"
                    placeholder="Biller Email"
                    value={billerInfo.email}
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, email: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="billerPhno">
                  <Form.Control
                    type="text"
                    name="biller_phno"
                    placeholder="Biller Phone"
                    value={billerInfo.phno}
                    required
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, phno: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="billerAddress">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="biller_address"
                    placeholder="Biller Address"
                    value={billerInfo.address}
                    required
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, address: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="billerGstNo">
                  <Form.Control
                    type="text"
                    name="biller_gst"
                    placeholder="Biller GST"
                    value={billerInfo.gst_no}
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, gst_no: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="billerDlNo">
                  <Form.Control
                    type="text"
                    name="biller_dlno"
                    placeholder="D.L No"
                    value={billerInfo.dl_no}
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, dl_no: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              id="billerInfoFormHiddenSubmitBtn"
              variant="secondary"
              className="d-none"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={billerInfonButtonHandler}>
            <FiSave className="icon-adjust-4" /> Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Customer Information Modal */}
      <Modal
        backdrop="static"
        keyboard={false}
        show={isCustomerModalShow}
        onHide={customerModalCloseHandler}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiUserPlus className="icon-adjust-2" /> Customer Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={customerFormSubmitHandler}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="customerName">
                  <Form.Control
                    type="text"
                    name="customer_name"
                    placeholder="Customer Name"
                    value={customerInfo.name}
                    required
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="customerEmail">
                  <Form.Control
                    type="email"
                    name="customer_email"
                    placeholder="Customer Email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="customerPhno">
                  <Form.Control
                    type="text"
                    name="customer_phno"
                    placeholder="Customer Phone"
                    value={customerInfo.phno}
                    required
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phno: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="customerAddress">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="customer_address"
                    placeholder="Customer Address"
                    value={customerInfo.address}
                    required
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="doctorName">
                  <Form.Control
                    type="text"
                    name="doctor_name"
                    placeholder="Doctor Name"
                    value={customerInfo.doctorName}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        doctorName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="customerBillDate">
                  <Form.Control
                    type="date"
                    name="customer_bill_date"
                    placeholder="Bill Date"
                    value={customerInfo.bill_date}
                    required
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        bill_date: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type="submit"
              id="customerInfoFormHiddenSubmitBtn"
              variant="secondary"
              className="d-none"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={customerInfonButtonHandler}>
            <FiSave className="icon-adjust-4" /> Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Bill;
