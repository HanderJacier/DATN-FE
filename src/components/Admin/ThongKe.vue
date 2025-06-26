<template>
  <div class="container-fluid bg-light py-4 min-vh-100">
    <!-- Tổng quan -->
    <div class="card p-4 mb-4 w-100">
      <h5 class="form-title bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block mb-3">TỔNG QUAN ĐƠN HÀNG HÔM NAY</h5>
      <div class="row g-3">
        <div class="col-md-3">
          <div class="bg-success text-white rounded-3 p-3 d-flex align-items-center">
            <i class="fa fa-plus-square fa-2x me-3"></i>
            <div>
              <p class="mb-0">Đơn hàng mới</p>
              <strong>32</strong>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-primary text-white rounded-3 p-3 d-flex align-items-center">
            <i class="fa fa-dollar-sign fa-2x me-3"></i>
            <div>
              <p class="mb-0">Doanh thu</p>
              <strong>1.500.420 VNĐ</strong>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-warning text-dark rounded-3 p-3 d-flex align-items-center">
            <i class="fa fa-retweet fa-2x me-3"></i>
            <div>
              <p class="mb-0">Đổi / trả</p>
              <strong>2</strong>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-danger text-white rounded-3 p-3 d-flex align-items-center">
            <i class="fa fa-times-circle fa-2x me-3"></i>
            <div>
              <p class="mb-0">Huỷ</p>
              <strong>5</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ -->
    <div class="card p-4 mb-4 w-100">
      <h5 class="form-title bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block mb-3">SƠ ĐỒ THỐNG KÊ</h5>
      <div class="row mb-3">
        <div class="col-md-6">
          <select class="form-select">
            <option>Doanh thu</option>
          </select>
        </div>
        <div class="col-md-6">
          <select class="form-select">
            <option>7 ngày qua</option>
            <option>14 ngày qua</option>
            <option>30 ngày qua</option>
          </select>
        </div>
      </div>
      <canvas id="revenueChart" style="height: 300px;"></canvas>
    </div>

    <!-- Báo cáo -->
    <div class="card p-4 w-100">
      <h5 class="form-title bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block mb-3">BẢNG BÁO CÁO DOANH THU</h5>
      <div class="d-flex justify-content-between mb-3">
        <select class="form-select w-auto">
          <option>7 ngày qua</option>
          <option>14 ngày qua</option>
          <option>30 ngày qua</option>
        </select>
        <button class="btn btn-primary">📤 Xuất báo cáo</button>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered text-center align-middle">
          <thead class="table-light">
            <tr>
              <th>Ngày</th>
              <th>Doanh thu</th>
              <th>Đơn hàng mới</th>
              <th>Đổi/trả</th>
              <th>Huỷ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>22/7</td>
              <td>25.000.000</td>
              <td>35</td>
              <td>5</td>
              <td>0</td>
            </tr>
            <tr>
              <td colspan="5" class="text-end">
                <strong>Tổng doanh thu: <span class="text-danger">105.000.000 đ</span></strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

onMounted(() => {
  const ctx = document.getElementById('revenueChart')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['22/7', '23/7', '24/7', '25/7', '26/7', '27/7'],
      datasets: [{
        label: 'Doanh thu',
        data: [25, 67, 85, 55, 22, 67],
        backgroundColor: '#4dabf7'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => value + 'tr'
          }
        }
      }
    }
  })
})
</script>