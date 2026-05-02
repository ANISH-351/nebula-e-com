import axios from 'axios'
import React, { useState, useEffect } from 'react'

function Product() {

    const [data, setdata] = useState([]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get('http://localhost:5000/product');
            setdata(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    return (
        <section>
            <div className='container mx-auto px-4 py-8'>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {data.map((item) => (
                        <div key={item.id} className='bg-white rounded-lg shadow-md p-4'>
                            <img className='w-full' src={item.image} alt="" />

                            <div>
                                <h1 className='text-xl font-bold'>
                                    {item.name}
                                </h1>
                                <h1 className='text-2xl font-bold text-green-500'>
                                    {item.price}
                                </h1>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Product