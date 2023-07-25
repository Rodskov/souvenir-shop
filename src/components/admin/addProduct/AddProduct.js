import { useState } from 'react';
import styles from "./AddProduct.module.scss";
import Card from '../../card/Card';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import { toast } from 'react-toastify';
import { Timestamp, addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../loader/Loader';
import { useSelector } from 'react-redux';
import { selectProducts } from '../../../redux/slice/productSlice';

const categories = [
  {id: 1, name: "Apparel"},
  {id: 2, name: "Accessories"},
  {id: 3, name: "Stationary"},
  {id: 4, name: "Miscellaneous"},
]

const initialState = {
  name: "",
  imageURL: "",
  price: 0,
  category: "",
  color: "",
  size: "",
  desc: "",
}

const AddProduct = () => {
  const [colorVar, setColorVar] = useState([])
  const [sizeVar, setSizeVar] = useState([])
  const [val, setVal] = useState([]);
  const {id} = useParams();
  const products = useSelector(selectProducts)
  const productEdit = products.find((item) => item.id === id)

  const colorHandleAdd = () => {
    const abc = [...colorVar, []]
    setColorVar(abc)
  }
  const sizeHandleAdd = () => {
    const abc = [...sizeVar, []]
    setSizeVar(abc)
  }

  const colorHandleChange = (onChangeValue, i) => {
    const inputData = [...colorVar]
    inputData[i]=onChangeValue.target.value
    setColorVar(inputData)
  }
  const colorHandleDelete = (i) => {
    const deleteVal = [...colorVar]
    deleteVal.splice(i,1)
    setColorVar(deleteVal)
  }

  const sizeHandleChange = (onChangeValue, i) => {
    const inputData = [...sizeVar]
    inputData[i]=onChangeValue.target.value
    setSizeVar(inputData)
  }
  const sizeHandleDelete = (i) => {
    const deleteVal = [...sizeVar]
    deleteVal.splice(i,1)
    setSizeVar(deleteVal)
  }
  console.log(colorVar, "data-")
  console.log(productEdit)

  const [product, setProduct] = useState(() => {
    const newState = detectForm(id, {...initialState},
      productEdit);
      return newState;
  });

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  

  function detectForm(id, f1, f2) {
    if (id === "ADD") {
      return f1;
    }
    return f2;
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setProduct({...product, [name]: value});
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log(file);

    const storageRef = ref(storage, `eshop/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    
    uploadTask.on('state_changed', 
      (snapshot) => {
    
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress)
      }, 
      (error) => {
        toast.error(error.message)
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProduct({...product, imageURL: downloadURL})
          toast.success("Image uploaded successfully.")
        });
      }
    );
  };

  const addProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const docRef = addDoc(collection(db, "products"), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        color: colorVar,
        size: sizeVar,
        desc: product.desc,
        createdAt: Timestamp.now().toDate()
      });
      setIsLoading(false)
      setUploadProgress(0)
      setProduct({...initialState})

      toast.success("Product uploaded successfully.")
      navigate("/admin/all-products")
    } catch(error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const editProduct = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (product.imageURL !== productEdit.imageURL) {
      const storageRef = ref(storage, productEdit.imageURL);
      deleteObject(storageRef);
    }

    try {
      setDoc(doc(db, "products", id), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,

        desc: product.desc,
        createdAt: productEdit.createdAt,
        editedAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      toast.success("Product edited successfully.");
      navigate("/admin/all-products");

    } catch(error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {isLoading && <Loader/>}
      <div className={styles.product}>
        <h2>{detectForm(id, "Add New Product", "Edit Product")}</h2>
        <Card cardClass={styles.card}>
          <form onSubmit={detectForm(id, addProduct, editProduct)}>
          <label>Product name:</label>
          <input 
            type='text' 
            placeholder='Product name' 
            required 
            name='name' 
            value={product.name} 
            onChange={(e) => handleInputChange(e)}/>
          
          <label>Product image:</label>
          <Card cardClass={styles.group}>
            {uploadProgress === 0 ? null : (
              <div className={styles.progress}>

              <div className={styles["progress-bar"]} style={{width: `${uploadProgress}%`}}>
                {uploadProgress < 100 ? `Uploading ${uploadProgress}` 
                : `Upload Complete ${uploadProgress}%`}
              </div>

            </div>
            )}
            
            <input type='file' 
              accept='image/*' 
              placeholder='Product Image' 
              name='image' 
              onChange={(e) => handleImageChange(e)}/>

              {product.imageURL === "" ? null : (
                <input type='text' 
                // required 
                placeholder='Image URL'
                name='imageURL' 
                value={product.imageURL} 
                disabled/> 
              )}
          
            
          </Card>
          
          <label>Product price:</label>
          <input 
            type='number' 
            placeholder='Product price' 
            required 
            name='price' 
            value={product.price} 
            onChange={(e) => handleInputChange(e)}/>

          <label>Product Catergory:</label>
          <select required name='category' value={product.category} 
            onChange={(e) => handleInputChange(e)}>
              <option value="" disabled>
                -- Choose product category --
              </option>
              {categories.map((cat) => {
                return (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                )
              })}
          </select>
          
          <label>Colors:</label>
          <Card cardClass={styles.group}>
          <button type="button" onClick={()=>colorHandleAdd()}>Add color</button>
          {colorVar.map((data, i) => {
            return(
              <div>
                <input type='text' value={data} onChange={e=>  colorHandleChange(e,i)} required/>
                <button type="button" onClick={()=>colorHandleDelete(i)}>x</button>
              </div>
            )
          })}
          </Card>
          <label>Size:</label>
          <Card cardClass={styles.group}>
          <button type="button" onClick={()=>sizeHandleAdd()}>Add size</button>
          {sizeVar.map((data, i) => {
            return(
              <div>
                <input type='text' value={data} onChange={e=>  sizeHandleChange(e,i)} required/>
                <button type="button" onClick={()=>sizeHandleDelete(i)}>x</button>
              </div>
            )
          })}
          </Card>
          {/* <label>Product Company/Brand:</label>
          <input 
            type='text' 
            placeholder='Product brand' 
            required 
            name='brand' 
            value={product.brand} 
            onChange={(e) => handleInputChange(e)}/> */}

          <label>Product Description:</label>
          <textarea 
            name='desc' 
            required 
            value={product.desc} 
            onChange={(e) => handleInputChange(e)}
            cols="30" rows="10">
          </textarea>
          
          <button className='--btn --btn-primary'>{detectForm(id, "Save Product", "Edit Product")}</button>
          
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddProduct;