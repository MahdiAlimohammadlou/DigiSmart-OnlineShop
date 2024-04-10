from django.db import models
from autoslug import AutoSlugField
from django.utils import timezone

class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=False)

class AbstractBaseModel(models.Model):
    """An abstract base model providing common fields and methods."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted = models.BooleanField(default=False)

    objects = models.Manager()  # Default manager

    soft_objects = SoftDeleteManager()  # Custom manager for soft deletes

    def delete(self, *args, **kwargs):
        # This method performs a physical delete if needed
        super(AbstractBaseModel, self).delete(*args, **kwargs)

    def soft_delete(self, *args, **kwargs):
        # Instead of deleting, set the 'deleted' flag to True
        self.deleted = True
        self.save()
        return True


    class Meta:
        abstract = True


class AbstractSlugModel(AbstractBaseModel):
    """ An abstract model representing a model with a title and auto-generated slug. """

    title = models.CharField(max_length=50)
    slug = AutoSlugField(unique=True, populate_from='title')
    description = models.TextField(null = True, blank = True)

    def __str__(self):
        return self.title

    class Meta:
        abstract = True