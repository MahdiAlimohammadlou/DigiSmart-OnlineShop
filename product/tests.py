from django.test import TestCase
from .models import Category, Brand, Product, ProductImage, Discount, DiscountCode, Comment, Banner
from accounts.models import User
from django.utils import timezone


class CategoryModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        Category.objects.create(title='Test Category', description='This is a test category')

    def test_title_content(self):
        category = Category.objects.get(id=1)
        expected_object_name = f'{category.title}'
        self.assertEqual(expected_object_name, 'Test Category')

    def test_description_content(self):
        category = Category.objects.get(id=1)
        expected_object_name = f'{category.description}'
        self.assertEqual(expected_object_name, 'This is a test category')

    def test_is_sub_default(self):
        category = Category.objects.get(id=1)
        self.assertFalse(category.is_sub)


class BrandModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        Brand.objects.create(title='Test Brand', description='This is a test brand')

    def test_title_content(self):
        brand = Brand.objects.get(id=1)
        expected_object_name = f'{brand.title}'
        self.assertEqual(expected_object_name, 'Test Brand')

    def test_description_content(self):
        brand = Brand.objects.get(id=1)
        expected_object_name = f'{brand.description}'
        self.assertEqual(expected_object_name, 'This is a test brand')


class ProductModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        category = Category.objects.create(title='Test Category', description='This is a test category')
        brand = Brand.objects.create(title='Test Brand', description='This is a test brand')
        Product.objects.create(title='Test Product', description='This is a test product', category=category, brand=brand, price=10.0, inventory=100)

    def test_title_content(self):
        product = Product.objects.get(id=1)
        expected_object_name = f'{product.title}'
        self.assertEqual(expected_object_name, 'Test Product')

    def test_description_content(self):
        product = Product.objects.get(id=1)
        expected_object_name = f'{product.description}'
        self.assertEqual(expected_object_name, 'This is a test product')

    def test_price(self):
        product = Product.objects.get(id=1)
        self.assertEqual(product.price, 10.0)

    def test_inventory(self):
        product = Product.objects.get(id=1)
        self.assertEqual(product.inventory, 100)

    def test_is_available(self):
        product = Product.objects.get(id=1)
        self.assertTrue(product.is_available)


class ProductImageModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        category = Category.objects.create(title='Test Category', description='This is a test category')
        brand = Brand.objects.create(title='Test Brand', description='This is a test brand')
        product = Product.objects.create(title='Test Product', description='This is a test product', category=category, brand=brand, price=10.0, inventory=100)
        ProductImage.objects.create(image='test_image.jpg', product=product)

    def test_image_upload(self):
        product_image = ProductImage.objects.get(id=1)
        self.assertEqual(product_image.image, 'test_image.jpg')


class DiscountModelTest(TestCase):
    def setUp(self):
        self.brand = Brand.objects.create(title='Test Brand', description='This is a test brand')

        self.category = Category.objects.create(title="Test Category", description="Test Description", slug="test-category")
        self.product = Product.objects.create(title="Test Product", description="Test Description", slug="test-product", category=self.category, brand=self.brand, price=100, inventory=10)

    def test_discount_with_product(self):
        start_date = timezone.now()
        end_date = start_date + timezone.timedelta(days=5)
        discount = Discount.objects.create(product=self.product, start_date=start_date, end_date=end_date, percentage=10)

        self.assertEqual(discount.product, self.product)
        self.assertIsNone(discount.category)
        self.assertEqual(discount.percentage, 10)
        self.assertIsNone(discount.amount)
        self.assertEqual(discount.start_date, start_date)
        self.assertEqual(discount.end_date, end_date)

    def test_discount_with_category(self):
        start_date = timezone.now()
        end_date = start_date + timezone.timedelta(days=5)
        discount = Discount.objects.create(category=self.category, start_date=start_date, end_date=end_date, amount=50)

        self.assertIsNone(discount.product)
        self.assertEqual(discount.category, self.category)
        self.assertEqual(discount.amount, 50)
        self.assertIsNone(discount.percentage)
        self.assertEqual(discount.start_date, start_date)
        self.assertEqual(discount.end_date, end_date)


class DiscountCodeModelTest(TestCase):
    def test_discount_code_creation(self):
        start_date = timezone.now()
        end_date = start_date + timezone.timedelta(days=5)
        discount_code = DiscountCode.objects.create(code=12345, start_date=start_date, end_date=end_date, percentage=10)

        self.assertEqual(discount_code.code, 12345)
        self.assertEqual(discount_code.percentage, 10)
        self.assertIsNone(discount_code.amount)
        self.assertEqual(discount_code.start_date, start_date)
        self.assertEqual(discount_code.end_date, end_date)

    # def test_discount_code_start_date_shamsi(self):
    #     start_date = timezone.now()
    #     discount_code = DiscountCode.objects.create(code=54321, start_date=start_date, end_date=start_date + timezone.timedelta(days=5), percentage=15)

    #     shamsi_start_date = discount_code.start_date_shamsi
    #     expected_shamsi_start_date = start_date.strftime('%Y/%m/%d %H:%M:%S')


class CommentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            email='test@example.com',
            phone_number='1234567890',
            full_name='John Doe',
            is_active=True,
            is_admin=False
        )
        category = Category.objects.create(title='Test Category', description='This is a test category')
        brand = Brand.objects.create(title='Test Brand', description='This is a test brand')
        self.product = Product.objects.create(title='Test Product', description='This is a test product', category=category, brand=brand, price=10.0, inventory=100)

    def test_comment_creation(self):
        comment_text = "This is a test comment."
        like_count = 5
        dislike_count = 2
        comment = Comment.objects.create(user=self.user, product=self.product, comment_text=comment_text, like=like_count, dislike=dislike_count)

        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.product, self.product)
        self.assertEqual(comment.comment_text, comment_text)
        self.assertEqual(comment.like, like_count)
        self.assertEqual(comment.dislike, dislike_count)

    def test_comment_like_increment(self):
        comment = Comment.objects.create(user=self.user, product=self.product, comment_text="Test Comment", like=0, dislike=0)
        comment.like += 1
        comment.save()

        self.assertEqual(comment.like, 1)

    def test_comment_dislike_increment(self):
        comment = Comment.objects.create(user=self.user, product=self.product, comment_text="Test Comment", like=0, dislike=0)
        comment.dislike += 1
        comment.save()

        self.assertEqual(comment.dislike, 1)


class BannerModelTest(TestCase):
    def test_banner_creation(self):
        title = "Test Banner"
        image_path = "banners/test_banner.jpg"
        banner = Banner.objects.create(title=title, image=image_path)

        self.assertEqual(banner.title, title)
        self.assertEqual(banner.image.name, image_path)
