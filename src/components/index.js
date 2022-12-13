import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

export const ProductList = () => {
  const [product, setProduct] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [viewAdd, setViewAdd] = useState(false);
  const [category, setCategory] = useState([]);
  const [catid, setcatid] = useState("");
  const [RowItem, SetRowItem] = useState("");
  const [ViewEdit, SetEditShow] = useState(false);
  useEffect(() => {
    loadProduct();
    categoryList();
  }, []);

  const handleClose = () => {
    SetEditShow(false);
  };

  const categoryList = async () => {
    const result = await axios.post("http://sangita.iosx.in:9000/api/category");
    console.log(result);
    setCategory(result.data.data);
  };
  const handleChange = (e) => {
    const cat = e.target.value;
    console.log(cat);
    setcatid(cat);
  };
  let catList =
    category.length > 0 &&
    category.map((item, i) => {
      let selected = item._id === catid ? true : false;
      console.log(selected);
      return (
        <option key={i} value={item._id} selected={selected}>
          {item.slug}
        </option>
      );
    });

  const loadProduct = async () => {
    const result = await axios.post("http://sangita.iosx.in:9000/api/product");
    console.log(result);
    setProduct(result.data.data);
    console.log("product", product);
  };

  const AddProduct = async () => {
    axios({
      url: "http://sangita.iosx.in:9000/api/product/add",
      method: "POST",
      data: {
        name: name,
        price: price,
        category: catid,
      },
    })
      .then((res) => {
        if (res && res.data.status === 200) {
          setName("");
          setPrice("");
          setcatid("");
          setViewAdd(false);
          const push = [
            {
              name: res.data.name,
              price: res.data.price,
              image: "http://sangita.iosx.in:9000/" + res.data.image,
            },
          ];
          setProduct([...product, ...push]);
        }
      })

      .catch((err) => {
        console.log("err===", err);
      });
  };
  const handleEditShow = () => {
    SetEditShow(true);
  };

  const handleEdit = () => {
    axios({
      url: `http://sangita.iosx.in:9000/api/product/edit`,
      method: "POST",
      data: {
        id: RowItem._id,
        name: name,
        price: price,
        category: catid,
      },
    })
      .then((res) => {
        if (res && res.data.status === 200) {
          SetEditShow(false);
          setName("");
          setPrice("");

          console.log("data====", res);
        }
      })

      .catch((err) => {
        console.log("err===", err);
      });
  };

  const handleAdd = () => {
    setViewAdd(true);
  };

  const handleDel = (id) => {
    axios({
      url: `http://sangita.iosx.in:9000/api/product/delete`,
      method: "POST",
      data: {
        id: id,
      },
    })
      .then((res) => {
        if (res && res.data.status === 200) {
          const filter = product.filter((item) => {
            return item._id !== id;
          });
          setProduct(filter)
        }
      })

      .catch((err) => {});
  };

  return (
    <>
      <div>
        <Button
          onClick={handleAdd}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          Add Product
        </Button>
        <h1>Home Page</h1>
        <table>
          <thead>
            <tr>
              <th>Sl.</th>
              <th>Product Name</th>
              <th>Product Price</th>
              <th>Image</th>
              {/* <th>Tags</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map((item, index) => {
              return (
                <>
                  <tr>
                    <th key={item._id}>{index + 1}</th>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>
                      <img
                        style={{ height: "100px", width: "100px" }}
                        src={item?.image}
                      />
                    </td>
                    {/* <td>
                      {item.tags
                        ? item.tags.map(() => {
                            return <>{item.title}</>;
                          })
                        : ""}
                    </td> */}
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => {
                          handleEditShow(
                            SetRowItem(item),
                            setName(item.name),
                            setPrice(item.price),
                            setcatid(item?.category[0]?._id)
                          );
                        }}
                      >
                        Edit
                      </Button>
                      <br />
                      <br/>
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => {
                          handleDel(item._id);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>

        <Modal
          show={ViewEdit}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Products</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label style={{ marginLeft: 10, marginRight: 10 }}>Name</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="please enter the product name"
                defaultValue={RowItem.name}
              />
              <br />
              <br />
              <label style={{ marginLeft: 10, marginRight: 10 }}>Price</label>
              <input
                type="text"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="please enter the Price"
                defaultValue={RowItem.price}
              />
              <br />
              <br />
              <select
                onChange={(e) => {
                  handleChange(e);
                }}
              >
                <option>Select Category</option>
                {catList}
              </select>
              <br />
              <br />
              <Button
                type="submit"
                className="btn btn-warning mt-4"
                onClick={handleEdit}
              >
                Edit Product
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={viewAdd}
          onHide={() => setViewAdd(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label style={{ marginLeft: 10, marginRight: 10 }}>
                Product Name
              </label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="please enter the product name"
                defaultValue={name}
              />
              <br />
              <br />
              <label style={{ marginLeft: 10, marginRight: 10 }}>Price</label>
              <input
                type="text"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="please enter the product price"
                defaultValue={price}
              />
              <br />
              <br />
              <select
                onChange={(e) => {
                  handleChange(e);
                }}
              >
                {catList}
              </select>
              <br />
              <br />
              <Button
                type="submit"
                className="btn btn-warning mt-4"
                onClick={AddProduct}
              >
                Add Product
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};
