<template>
  <div class="container-fluid py-4">
    <div class="card p-4 mb-4" style="width: 100%;">
      <h5 class="form-title mb-3 bg-warning text-dark fw-bold px-3 py-2 rounded-2 d-inline-block">GÓP Ý CỦA NGƯỜI DÙNG</h5>
      <div class="row g-2 mb-3">
        <div class="col-md-8">
          <input type="text" placeholder="Tìm kiếm người dùng...." class="form-control" />
        </div>
        <div class="col-md-4">
          <select class="form-select">
            <option>Tất cả</option>
            <option>Đã xem</option>
            <option>Chưa xem</option>
          </select>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered text-center align-middle" style="width: 100%;">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Tên người dùng</th>
              <th>Nội dung góp ý</th>
              <th>Ngày gửi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Nguyễn Văn A</td>
              <td>Trang web dễ dùng...</td>
              <td>15/7/2025</td>
              <td>
                <button class="btn btn-outline-primary btn-sm">
                  <i class="fa fa-eye"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>