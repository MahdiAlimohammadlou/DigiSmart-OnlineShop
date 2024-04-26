import redis, json
from django.conf import settings

class CartManager:
    def __init__(self):
        self.redis_client = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.CART_REDIS_DB,
        )

    def add_to_cart(self, username, cart):
        # Add product to cart
        self.redis_client.set(username, cart)

    def get_cart(self, username):
        # Get user's cart
        result = self.redis_client.get(username)
        if result:
            result_json = result.decode("utf-8")
            result_list = json.loads(result_json)
            return result_list
        else:
            return None
    
    def delete_cart(self, username):
        # Delete user's cart
        self.redis_client.delete(username)
