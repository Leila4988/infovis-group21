import pandas as pd
from . import models

# Load data as panda dfs #
artist_data = pd.read_csv('app/data/artist.csv')
year_data = pd.read_csv('app/data/new_year.csv')
color_data = pd.read_csv('app/data/new_colors.csv')
artwork_data = pd.read_csv('app/data/artwork_colors.csv')
usage_data = pd.read_csv('app/data/usage.csv')
color_list = pd.read_csv('app/data/colorlist.csv')