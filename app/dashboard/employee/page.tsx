"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  title: string;
  description: string;
  employeeId?: string;
}

export default function КабинетСотрудника() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  // Состояние для временных изменений статуса для каждого заказа
  const [statusUpdates, setStatusUpdates] = useState<Record<string, string>>({});

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "EMPLOYEE") {
      router.push("/auth"); // Если пользователь не сотрудник — перенаправляем на страницу авторизации
    } else {
      setIsAuthorized(true);
      fetchOrders();
    }
  }, []);

  // Функция для получения заказов с сервера
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:4000/orders");
      if (response.ok) {
        const data: Order[] = await response.json();
        setOrders(data);
      } else {
        console.error("Ошибка при загрузке заказов");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса заказов", error);
    }
  };

  // Функция для обновления временного статуса заказа
  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  // Функция для отправки обновленного статуса заказа на сервер и обновления локального состояния без изменения порядка карточек
  const updateOrderStatus = async (orderId: string) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;
    try {
      const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newStatus }),
      });
      if (response.ok) {
        // Обновляем только статус измененного заказа, не меняя порядок карточек
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, description: newStatus } : order
          )
        );
      } else {
        console.error("Ошибка при обновлении статуса заказа");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса на обновление", error);
    }
  };

  if (!isAuthorized) {
    return <div className="text-center mt-10">Перенаправление...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Кабинет сотрудника</h1>  <div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/auth";
            }}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition mt-4 mb-4"
          >
            Выйти
          </button>
        </div>
      <div>
        
      </div>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{order.title}</h3>
            <p className="mb-2">
              <span className="font-bold">Текущий статус:</span> {order.description}
            </p>
            <div className="flex items-center space-x-2">
              <select
                className="border p-1 rounded"
                value={statusUpdates[order.id] || order.description}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                <option value="Назначен – заказ назначен сотруднику.">Назначен</option>
                <option value="В процессе – заказ в работе.">В процессе</option>
                <option value="Выполнен – заказ успешно завершён">Выполнен</option>
                <option value="Отменён – заказ отменён.">Отменён</option>
              </select>
              <button
                onClick={() => updateOrderStatus(order.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Обновить статус
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
