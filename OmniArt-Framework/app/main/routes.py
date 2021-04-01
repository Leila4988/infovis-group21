from flask import render_template, request, jsonify, Response
import os, json

from decimal import Decimal

import pandas as pd
from pandas import Series,DataFrame
import numpy as np

from app import models, data
from . import main


@main.route('/', methods=['GET'])
def index():
	return render_template("frame.html")

@main.route('/artists_data', methods = ['GET'])
def artists_data():
	plot_data = data.artist_data
	plot_data = plot_data.to_json(orient='records')

	return plot_data

@main.route('/year_data', methods = ['GET'])
def year_data():
	artist_name = request.args.get("artist_name")
	plot_data = data.year_data.loc[data.year_data['artist'] == artist_name]
	plot_data = plot_data.to_json(orient='records')

	return plot_data

@main.route('/color_data', methods = ['GET'])
def color_data():
	artist_name = request.args.get("artist_name")
	year = int(request.args.get("year"))
	plot_data = data.color_data.loc[(data.color_data['artist'] == artist_name) & (data.color_data['year'] == year)]
	plot_data = plot_data.to_json(orient='records')

	return plot_data

@main.route('/artwork_data', methods = ['GET'])
def artwork_data():
	id = int(request.args.get("id"))
	plot_data = data.artwork_data.loc[(data.artwork_data['artwork_id'] == id)]
	names = []
	parents = []
	values = []
	colors = []
	for index, row in plot_data.iterrows():
		names.append("child" + str(index))
		parents.append(str(row['artwork_id']))
		values.append(row['palette_count'])
		colors.append(row['color_pallete'])
	newdata = {'name': Series(names), 'parent': Series(parents), 'value': Series(values), 'color': Series(colors)}
	df = DataFrame(newdata)
	insertRow = pd.DataFrame([[str(id),'','','']],columns = ['name','parent','value','color'])
	newData = pd.concat([insertRow,df],ignore_index = True)
	plot_data = newData.to_json(orient='records')

	return plot_data

@main.route('/image_data', methods = ['GET'])
def image_data():
	image_id = request.args.get("id")
	imgPath = "app/data/images/"+image_id+".jpg"
	with open(imgPath, 'rb') as f:
		image = f.read()
	resp = Response(image, mimetype="image/jpeg")
	return resp

@main.route('/color_list', methods = ['GET'])
def color_list():
	plot_data = data.color_list
	plot_data = plot_data.to_json(orient='records')
	return plot_data


#
@main.route('/usage_data', methods = ['GET'])
def usage_data():
	colour_name = request.args.get("colour_name")
	plot_data = data.usage_data.loc[data.usage_data['colour_name'] == colour_name]
	plot_data = plot_data.to_json(orient='records')

	return plot_data



