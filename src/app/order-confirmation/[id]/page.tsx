"use client";
import MainLayout from "@/layout/MainLayout";
import OrderAPI from "@/services/orderApi";
import { CheckCircle, Package, Truck, Clock } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderDetails {
  _id: string;
  orderNumber: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    thumbnail?: string;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
}

const OrderConfirmation = () => {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await OrderAPI.getOrderById(orderId);
        if (response.success) {
          setOrder(response.data);
        } else {
          setError("Order not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-BtnBlack"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center px-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-headingColor mb-4">Order Not Found</h2>
            <p className="text-lightText mb-6">{error || "This order does not exist or has been removed."}</p>
            <Link href="/" className="bg-BtnBlack text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all">
              Return to Home
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-5 sm:px-10 lg:px-20">
        {/* Success Header */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-headingColor mb-2">Order Confirmed!</h1>
            <p className="text-lightText mb-4">
              Thank you for your order. We've received it and will start processing shortly.
            </p>
            <div className="bg-gray-100 inline-block px-6 py-3 rounded-md">
              <p className="text-sm text-lightText">Order Number</p>
              <p className="text-xl font-semibold text-headingColor">{order.orderNumber}</p>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-xl font-semibold text-headingColor mb-6">Order Status</h2>
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  order.status === "pending" ? "bg-blue-500" : "bg-green-500"
                } text-white mb-2`}>
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Pending</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  ["processing", "shipped", "delivered"].includes(order.status) ? "bg-green-500" : "bg-gray-200"
                } text-white mb-2`}>
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Processing</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  ["shipped", "delivered"].includes(order.status) ? "bg-green-500" : "bg-gray-200"
                } text-white mb-2`}>
                  <Truck className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Shipped</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  order.status === "delivered" ? "bg-green-500" : "bg-gray-200"
                } text-white mb-2`}>
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Delivered</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h2 className="text-xl font-semibold text-headingColor mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    {item.thumbnail && (
                      <img src={item.thumbnail} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <p className="font-medium text-headingColor">{item.productName}</p>
                      <p className="text-sm text-lightText">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-headingColor">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-headingColor mb-4">Shipping Address</h2>
              <div className="text-lightText space-y-1">
                <p className="font-medium text-headingColor">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
                {order.shippingAddress.email && <p>Email: {order.shippingAddress.email}</p>}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-headingColor mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-lightText">Subtotal</p>
                  <p className="font-medium text-headingColor">${order.subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-lightText">Shipping</p>
                  <p className="font-medium text-headingColor">${order.shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-lightText">Tax</p>
                  <p className="font-medium text-headingColor">${order.tax.toFixed(2)}</p>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <p className="text-lg font-semibold text-headingColor">Total</p>
                  <p className="text-lg font-semibold text-headingColor">${order.total.toFixed(2)}</p>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-lightText">Payment Status</p>
                  <p className="font-medium text-headingColor capitalize">{order.paymentStatus}</p>
                  {order.notes && (
                    <p className="text-sm text-lightText mt-2">{order.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-lightText mb-6">
              We've sent a confirmation email with your order details. If you have any questions, please contact our customer support.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/"
                className="bg-BtnBlack text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition-all"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => window.print()}
                className="border border-BtnBlack text-BtnBlack px-8 py-3 rounded-md hover:bg-gray-50 transition-all"
              >
                Print Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmation;
