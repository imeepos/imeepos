import torch
from core.embed import PositionalEmbedding

ps = PositionalEmbedding(d_model=12)

x = torch.LongTensor([[1,2,3,4]])

y = ps(x)

print(y.shape)