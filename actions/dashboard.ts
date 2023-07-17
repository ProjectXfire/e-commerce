import { type IResponse } from '@/app/shared/interfaces';
import prismaDb from '@/lib/prismadb';

interface IGraphData {
  name: string;
  total: number;
}

export async function getTotalRevenue(storeId: string): Promise<IResponse<number | null>> {
  try {
    const paidOrders = await prismaDb.order.findMany({
      where: { storeId, isPaid: true },
      include: { orderItems: { include: { product: true } } }
    });
    const totalRevenue = paidOrders.reduce(
      (acc, cv) => acc + cv.orderItems.reduce((acc, cv) => acc + +cv.product.price, 0),
      0
    );
    return {
      data: totalRevenue,
      errorMessage: null,
      message: 'All ok'
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: 'Something went wrong!',
      message: null
    };
  }
}

export async function getSalesCount(storeId: string): Promise<IResponse<number | null>> {
  try {
    const salesCount = await prismaDb.order.count({ where: { storeId, isPaid: true } });
    return {
      data: salesCount,
      errorMessage: null,
      message: 'All ok'
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: 'Something went wrong!',
      message: null
    };
  }
}

export async function getStockCount(storeId: string): Promise<IResponse<number | null>> {
  try {
    const stockCount = await prismaDb.product.count({ where: { storeId, isArchived: false } });
    return {
      data: stockCount,
      errorMessage: null,
      message: 'All ok'
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: 'Something went wrong!',
      message: null
    };
  }
}

export async function getGraphRevenue(storeId: string): Promise<IResponse<IGraphData[]>> {
  try {
    const paidOrders = await prismaDb.order.findMany({
      where: { storeId, isPaid: true },
      include: { orderItems: { include: { product: true } } }
    });
    const monthlyRevenue: Record<number, number> = {};
    for (const order of paidOrders) {
      const month = order.createdAt.getMonth();
      let revenueForOrder = 0;
      for (const prod of order.orderItems) {
        revenueForOrder += prod.product.price.toNumber();
      }
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }
    const graphData: IGraphData[] = [
      { name: 'Jan', total: 0 },
      { name: 'Feb', total: 0 },
      { name: 'Mar', total: 0 },
      { name: 'Apr', total: 0 },
      { name: 'May', total: 0 },
      { name: 'Jun', total: 0 },
      { name: 'Jul', total: 0 },
      { name: 'Aug', total: 0 },
      { name: 'Sep', total: 0 },
      { name: 'Oct', total: 0 },
      { name: 'Nov', total: 0 },
      { name: 'Dec', total: 0 }
    ];
    for (const month in monthlyRevenue) {
      graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }
    return {
      data: graphData,
      errorMessage: null,
      message: 'All ok'
    };
  } catch (error) {
    return {
      data: [],
      errorMessage: 'Something went wrong!',
      message: null
    };
  }
}
