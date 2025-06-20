<template>
  <HeaderComponent />
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb p-2" style="background-color: #eaf0fc;">
      <li class="breadcrumb-item">
        <a href="/" class="text-primary">Trang chủ</a>
      </li>
      <li class="breadcrumb-item">
        <a href="/" class="text-primary">Laptop</a>
      </li>
      <li class="breadcrumb-item active text-muted" aria-current="page">Laptop MSI</li>
    </ol>
  </nav>

  <div class="container my-5">
    <div class="row">
      <div class="col-md-6">


        <!-- Ảnh sản phẩm -->
        <div id="productCarousel" class="carousel slide">
          <div class="carousel-inner">
            <div class="carousel-item active">
              <div class="fixed-image-frame mx-auto d-flex justify-content-center align-items-center">
                <img :src="productImages[currentIndex].src" :alt="productImages[currentIndex].alt"
                  class="fixed-product-img" />
              </div>
            </div>
          </div>
        </div>



        <!-- Hình ảnh nhỏ của sản phẩm -->
        <div class="d-flex gap-2 flex-wrap mt-3 justify-content-center">
          <img v-for="(image, index) in thumbnails" :key="index" :src="image" class="img-thumbnail border border-2"
            :class="{ 'border-dark': index === currentIndex }"
            style="width: 100px; height: 100px; object-fit: cover; cursor: pointer" @click="changeImage(index)"
            :alt="`Ảnh sản phẩm ${index + 1}`" />
        </div>




        <!-- Thông số kỹ thuật -->
        <div class="card p-3 mb-4 mt-5">
          <h6 class="fw-bold border-bottom pb-2">Thông số kỹ thuật</h6>

          <h6 class="mt-3 mb-2">Bộ xử lý</h6>
          <div class="d-flex justify-content-between small py-1 border-bottom" v-for="(value, label) in specs.cpu"
            :key="label">
            <span>{{ label }}</span><span>{{ value }}</span>
          </div>

          <h6 class="mt-4 mb-2">Đồ họa</h6>
          <div class="d-flex justify-content-between small py-1 border-bottom" v-for="(value, label) in specs.gpu"
            :key="label">
            <span>{{ label }}</span><span>{{ value }}</span>
          </div>

          <div v-if="showMore">
            <h6 class="mt-4 mb-2">Khác</h6>
            <div class="d-flex justify-content-between small py-1 border-bottom" v-for="(value, label) in specs.other"
              :key="label">
              <span>{{ label }}</span><span>{{ value }}</span>
            </div>
          </div>

          <!-- Nút xem thêm -->
          <div class="text-center mt-3">
            <button class="btn btn-outline-secondary btn-sm bg-success text-white" @click="toggleMore">
              {{ showMore ? 'Thu gọn' : 'Xem thêm' }}
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <h5 class="fw-bold">
          Laptop MSI Gaming Vector 16 HX AI A2XWHG-010VN U7 255HX/16QHD+/RTX5070Ti_12GB//Win11
        </h5>
        <!-- Đánh giá và yêu thích -->
        <div class="d-flex align-items-center mb-3">
          <div class="me-2 text-warning">★ ★ ★ ★ ★</div>
          <small class="me-3 text-muted">Đã bán 9</small>
          <small class="me-3 text-muted">4 Đánh giá</small>
          <div class="text-danger">
            ❤️ <span class="text-dark">Yêu thích</span>
          </div>
        </div>

        <!-- Màu sắc -->
        <div class="mb-2">
          <label class="fw-semibold me-3">Màu sắc</label>
          <button class="btn btn-outline-primary active me-2">Đen</button>
          <button class="btn btn-outline-secondary me-2">Xám</button>
          <button class="btn btn-outline-secondary">Bạc</button>
        </div>

        <!-- Dung lượng -->
        <div>
          <label class="fw-semibold me-3">Dung lượng</label>
          <button class="btn btn-outline-secondary me-2">16GB RAM 512GB SSD</button>
          <button class="btn btn-outline-primary active">32GB RAM 1TB SSD</button>
        </div>

        <!--Giá-->
        <div class="p-3 rounded-3 mt-3 " style="background-color: #e5edfb; max-width: 550px;">
          <div>
            <h5 class="fw-bold mb-1">50.990.000 đ</h5>
            <span class="text-decoration-line-through text-secondary me-2">54.990.000 đ</span>
            <span class="text-danger fw-semibold">-7%</span>
          </div>

          <div class="bg-white p-4 rounded-3 mt-3">
            <div class="fw-semibold">Khuyến mãi</div>
            <div>. Giảm ngay 4.000.000 áp dụng đến hết 30/7</div>
          </div>
        </div>
        <div class="p-3 rounded-3 mt-3 border rounded p-3 mb-3 mt-4 " style="max-width: 550px;">
          <!--Khuyến mãi và thanh toán-->
          <div class="border rounded p-3 mb-3" style="max-width: 700px; background-color: #f5f5f5;">
            <h6 class="fw-bold border-bottom pb-2">Khuyến mãi thanh toán</h6>
            <div class="d-flex gap-3 flex-wrap mt-2">
              <img
                src="data:image/png;base64,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"
                alt="ZaloPay" height="40">
              <img
                src="data:image/png;base64,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"
                alt="Sacombank" height="40">
              <img
                src="data:image/png;base64,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"
                alt="Visa" height="40">
              <img
                src="data:image/jpeg;base64,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"
                alt="HDBank" height="40">
            </div>
          </div>

          <!-- Quà tặng và ưu đãi khác -->
          <div class="border rounded p-3 mb-3" style="max-width: 700px; background-color: #f5f5f5;">
            <h6 class="fw-bold border-bottom pb-2">Quà tặng và ưu đãi khác</h6>
            <ul class="list-unstyled mt-2">
              <li class="mb-1 text-danger"><i class="bi bi-gift-fill me-2"></i>Tặng 1 năm bảo hành</li>
              <li class="mb-1 text-danger"><i class="bi bi-gift-fill me-2"></i>Tặng phiếu mua hàng 200.000
                đ (hạn sử dụng 15 ngày)</li>
              <li class="mb-1 text-danger"><i class="bi bi-gift-fill me-2"></i>Tặng Balo chính hãng</li>
            </ul>
          </div>

          <!-- Gói bảo hành -->
          <div class="border rounded p-3 mb-3" style="max-width: 700px; background-color: #f5f5f5;">
            <h6 class="fw-bold border-bottom pb-2">Gói bảo hành</h6>

            <div class="border rounded p-3 mb-2 bg-white">
              <p class="fw-bold mb-1">Đặc quyền bảo hành thêm 1 năm</p>
              <span class="text-danger fw-bold">700.000 đ</span>
              <span class="text-muted text-decoration-line-through ms-2">1.100.000 đ</span>
            </div>

            <div class="border rounded p-3 bg-white">
              <p class="fw-bold mb-1">Đặc quyền bảo hành trọn đời</p>
              <span class="text-danger fw-bold">2.100.000 đ</span>
              <span class="text-muted text-decoration-line-through ms-2">54.900.000 đ</span>
            </div>
          </div>
        </div>
        <div class="col-md-6 mx-auto mt-5">
          <!--Nút Thêm giỏ hàng-->
          <button class="btn btn-outline-primary w-auto mx-3 "><i class="bi bi-cart-fill"></i> </button>
          <!--Nút Mua ngay-->
          <button class="btn btn-primary px-5 py-2 fw-bold">
            Mua ngay
          </button>
        </div>
      </div>
    </div>
    <!-- Mô tả sản phẩm -->
    <div class="container my-5 mt-1">
      <h4 class="fw-bold mb-3">Mô tả sản phẩm</h4>
      <div class="bg-light p-4 rounded-4">
        <div class="row g-4">
          <!-- Cột mô tả -->
          <div class="col-lg-8">
            <p>
              Chiếc laptop gaming linh hoạt và sắc sảo<br>
              Ở MSI Vector 16 HX A2XWHG-010VN, bạn sẽ bắt gặp ngôn ngữ thiết kế cao cấp, được hoàn thiện
              bền bỉ và chỉnh chu...
            </p>
            <p>
              Với kích thước 357 x 284 x 22.2mm và trọng lượng khoảng 2.7kg, laptop đủ linh hoạt để di
              chuyển dễ dàng...
            </p>
            <p>
              Được chế tác hướng tới cộng đồng làm kỹ thuật, công nghệ, thiết kế và truyền thông,
              <strong>MSI Vector 16 HX AI A2XWHG-010VN</strong> ghi điểm nhờ cấu hình xuất sắc...
            </p>

            <transition name="fade">
              <div v-if="showFullDescription">
                <p>
                  Laptop này còn sở hữu hệ thống tản nhiệt độc quyền, pin dung lượng lớn và khả năng
                  nâng cấp dễ dàng.
                </p>
                <p>
                  Hệ thống âm thanh Nahimic, màn hình 2K tần số quét 165Hz và độ phủ màu 100% sRGB
                  giúp trải nghiệm hình ảnh mượt mà và trung thực...
                </p>
              </div>
            </transition>

            <div class="text-center mt-3">
              <button class="btn btn-outline-dark px-4" @click="toggleDescription">
                {{ showFullDescription ? 'Thu gọn' : 'Xem thêm' }}
              </button>
            </div>
          </div>

          <!-- Cột hình ảnh -->
          <div class="col-lg-2 d-flex flex-column gap-1 mx-auto">
            <img
              src="https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/MSI_Thin_15_B12_UCX_18_61d8527eba.jpg"
              class="img-fluid rounded" alt="Ảnh 1">
            <img
              src="https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_61070ff9c3.png"
              class="img-fluid rounded" alt="Ảnh 2">
          </div>
        </div>
      </div>
    </div>

    <!--Đánh giá và bình luận-->
    <div class="container my-5 mt-1">
      <h4 class="fw-bold mb-3">Đánh giá và bình luận</h4>
      <div class="row">
        <!-- Tổng sao -->
        <div class="col-md-3 text-center">
          <div class="fs-1 fw-bold">4.9</div>
          <div class="text-warning fs-4">
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </div>
        </div>
        <!-- Biểu đồ sao -->
        <div class="col-md-7">
          <div class="d-flex align-items-center mb-2">
            <span class="me-2">5</span>
            <div class="progress w-100 me-2" style="height: 10px;">
              <div class="progress-bar bg-danger" style="width: 90%;"></div>
            </div>
            <span class="text-warning">&#9733;</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <span class="me-2">4</span>
            <div class="progress w-100 me-2" style="height: 10px;">
              <div class="progress-bar bg-danger" style="width: 60%;"></div>
            </div>
            <span class="text-warning">&#9733;</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <span class="me-2">3</span>
            <div class="progress w-100 me-2" style="height: 10px;">
              <div class="progress-bar bg-secondary" style="width: 20%;"></div>
            </div>
            <span class="text-warning">&#9733;</span>
          </div>
          <div class="d-flex align-items-center mb-2">
            <span class="me-2">2</span>
            <div class="progress w-100 me-2" style="height: 10px;">
              <div class="progress-bar bg-secondary" style="width: 10%;"></div>
            </div>
            <span class="text-warning">&#9733;</span>
          </div>
          <div class="d-flex align-items-center mb-3">
            <span class="me-2">1</span>
            <div class="progress w-100 me-2" style="height: 10px;">
              <div class="progress-bar bg-secondary" style="width: 5%;"></div>
            </div>
            <span class="text-warning">&#9733;</span>
          </div>
        </div>
        <!-- Nhập đánh giá -->
        <div class="mt-4">
          <form class="d-flex mb-3">
            <input type="text" class="form-control me-2" placeholder="Nhập nội dung đánh giá...">
            <button class="btn btn-primary">Gửi đánh giá</button>
          </form>

          <!-- Filter sao -->
          <div class="mb-4 d-flex flex-wrap gap-2">
            <button class="btn btn-outline-secondary btn-sm">Tất cả</button>
            <button class="btn btn-outline-warning btn-sm">5 ★</button>
            <button class="btn btn-outline-warning btn-sm">4 ★</button>
            <button class="btn btn-outline-warning btn-sm">3 ★</button>
            <button class="btn btn-outline-warning btn-sm">2 ★</button>
            <button class="btn btn-outline-warning btn-sm">1 ★</button>
          </div>

          <!-- Danh sách đánh giá -->
          <div class="mb-3">
            <!-- Đánh giá 1 -->
            <div class="d-flex mb-3">
              <div class="rounded-circle bg-danger text-white d-flex justify-content-center align-items-center me-3"
                style="width: 40px; height: 40px;">
                T
              </div>
              <div>
                <div class="fw-bold">Thư Nguyễn <span class="text-muted fs-6">· 2 ngày trước</span>
                </div>
                <div class="text-warning">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <div>Dịch vụ giao hàng nhanh, sản phẩm đúng như mô tả.</div>
                <button class="btn btn-sm btn-outline-secondary mt-1">👍 2</button>
              </div>
            </div>

            <!-- Đánh giá 2 -->
            <div class="d-flex mb-3">
              <div class="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
                style="width: 40px; height: 40px;">
                N
              </div>
              <div>
                <div class="fw-bold">Ngọc Huyền <span class="text-muted fs-6">· 5 giờ trước</span></div>
                <div class="text-warning">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <div>Sản phẩm tốt</div>
                <button class="btn btn-sm btn-outline-secondary mt-1">👍 0</button>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button class="btn btn-outline-dark">Xem thêm đánh giá khác</button>
          </div>
        </div>
      </div>
    </div>





    <!-- Sản phẩm tương tự -->
    <div class="container my-5 mt-1">
      <h4 class="fw-bold mb-3">Sản phẩm tương tự</h4>
      <div class="row">
        <div id="productCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item" :class="{ active: index === 0 }" v-for="(slide, index) in chunkedProducts"
              :key="index">
              <div class="row row-cols-1 row-cols-md-5 g-4">
                <div class="col" v-for="(product, i) in slide" :key="i">
                  <div class="card h-100 text-center">
                    <img :src="product.image" class="card-img-top" :alt="product.name" />
                    <div class="card-body">
                      <h6 class="card-title">{{ product.name }}</h6>
                      <p class="text-decoration-line-through text-muted small">{{ product.oldPrice }}</p>
                      <p class="text-danger small">{{ product.discount }}</p>
                      <p class="fw-bold text-danger">{{ product.newPrice }}</p>
                      <a href="#" class="btn btn-primary btn-sm">Mua ngay</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Nút điều hướng -->
            <button class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FooterComponent />
</template>

<script>
import HeaderComponent from '../User/Title/Header.vue'
import FooterComponent from '../User/Title/Footer.vue'

export default {
  name: 'ProductCarousel',
  components: {
    HeaderComponent,
    FooterComponent,
  },
  data() {
    return {
      // ---- ẢNH SẢN PHẨM ----
      currentIndex: 0,
      productImages: [
        {
          src: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/MSI_Thin_15_B12_UCX_18_61d8527eba.jpg',
          alt: 'Ảnh sản phẩm 1',
        },
        {
          src: 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_61070ff9c3.png',
          alt: 'Ảnh sản phẩm 2',
        },
        {
          src: 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_1_502129b847.png',
          alt: 'Ảnh sản phẩm 3',
        },
        {
          src: 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_2_22b97279ed.png',
          alt: 'Ảnh sản phẩm 4',
        },
        {
          src: 'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_4_d76e6974b3.png',
          alt: 'Ảnh sản phẩm 5',
        },
      ],
      thumbnails: [
        'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/MSI_Thin_15_B12_UCX_18_61d8527eba.jpg',
        'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_61070ff9c3.png',
        'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_1_502129b847.png',
        'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_2_22b97279ed.png',
        'https://cdn2.fptshop.com.vn/unsafe/750x0/filters:format(webp):quality(75)/msi_thin_a15_b7u_4_d76e6974b3.png'
      ],

      // ---- THÔNG SỐ KỸ THUẬT ----
      showMore: false,
      specs: {
        cpu: {
          'Hãng CPU': 'Intel',
          'Công nghệ CPU': 'Ultra7',
          'Loại CPU': '255H',
          'Tốc độ CPU tối thiểu': '2.4GHz',
          'Tốc độ tối đa': '5.2GHz',
          'Số nhân': '20',
          'Số luồng': '20',
          'Bộ nhớ đệm': '12MB'
        },
        gpu: {
          'Hãng (Card rời)': 'NVIDIA',
          'Model (Card rời)': 'GeForce RTX 5070 Ti',
          'Tên đầy đủ': 'NVIDIA GeForce RTX 5070 Ti 12GB',
          'Bộ nhớ': '12GB'
        },
        other: {
          'RAM': '32GB DDR5',
          'Ổ cứng': '1TB SSD',
          'Màn hình': '16" QHD+'
        }
      },

      // ---- MÔ TẢ SẢN PHẨM ----
      showFullDescription: false,

      // ---- SẢN PHẨM TƯƠNG TỰ ----
      similarProducts: [
        {
          name: 'Laptop Asus Vivobook 15',
          oldPrice: '34.000.000 đ',
          discount: '-12%',
          newPrice: '32.000.000 đ',
          image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_13__7_33.png'
        },
        {
          name: 'Laptop HP Envy X360 14',
          oldPrice: '25.990.000 đ',
          discount: '-25%',
          newPrice: '19.390.000 đ',
          image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_11__5_119.png'
        },
        {
          name: 'Huawei MatePad 11.5”S',
          oldPrice: '14.990.000 đ',
          discount: '-14%',
          newPrice: '12.490.000 đ',
          image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-tinh-bang-huawei-matepad-11-5-s_42_.png'
        },
        {
          name: 'Laptop Acer Nitro V15',
          oldPrice: '21.990.000 đ',
          discount: '-6%',
          newPrice: '20.690.000 đ',
          image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_11__4_19.png'
        },
        {
          name: 'Laptop HP Envy X360',
          oldPrice: '45.390.000 đ',
          discount: '-24%',
          newPrice: '41.090.000 đ',
          image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/l/a/laptop-hp-pavilion-x360-14-dy0168tu-4y1d3pa-1_1_1_2.jpg'
        },
        // Có thể thêm sản phẩm khác
      ]
    };
  },
  computed: {
    filteredReviews() {
      if (this.filterStars === 0) return this.reviews.slice(0, this.reviewDisplayLimit);
      return this.reviews.filter(r => r.stars === this.filterStars).slice(0, this.reviewDisplayLimit);
    },
    chunkedProducts() {
      const perSlide = 5;
      const chunks = [];
      for (let i = 0; i < this.similarProducts.length; i += perSlide) {
        chunks.push(this.similarProducts.slice(i, i + perSlide));
      }
      return chunks;
    }
  },
  methods: {
    // Đổi ảnh sản phẩm
    changeImage(index) {
      this.currentIndex = index;
    },

    // Toggle xem thêm thông số
    toggleMore() {
      this.showMore = !this.showMore;
    },

    // Toggle mô tả
    toggleDescription() {
      this.showFullDescription = !this.showFullDescription;
    }
  }
};
</script>




<style scoped>
.carousel-inner {
  display: flex;
  overflow: hidden;
}

.carousel-item {
  display: flex;
  justify-content: center;
  flex: 0 0 100%;
}

.fixed-image-frame {
  width: 400px;
  height: 400px;
  background-color: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.fixed-product-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
