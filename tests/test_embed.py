import torch
import unittest
from core.embed import PositionalEmbedding

class TestEmbed(unittest.TestCase):
    
    def test_positional_embedding(self):
        pe = PositionalEmbedding(12)
        x = torch.LongTensor([[1]])
        y = pe(x)
        w,h,t = y.size()
        self.assertEqual(w,1)
        self.assertEqual(h,1)
        self.assertEqual(t,12)
        