# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"
import argparse
import torch
import torch.nn as nn
import numpy as np
import os
import pickle
# from data_loader import get_loader
# from build_vocab import Vocabulary
from model_fastText import EncoderCNN, DecoderRNN
from torch.nn.utils.rnn import pack_padded_sequence
from torchvision import transforms

import pandas as pd
from typing import Any, Text, Dict, List
#
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
#python -m rasa_core_sdk.endpoint --actions actions

class ActionTellSummary(Action):

    def __init__(self) -> None:
        if not os.path.exists("allcontent_required_NotNull_sum_outFastText.ckpt"):
            os.makedirs(allcontent_required_NotNull_sum_outFastText.ckpt)

        # Load vocabulary wrapper
        with open("fasttext.model", 'rb') as f:
            self.emb_model = pickle.load(f)
        print("1")

        self.emb_model_weights = self.emb_model.wv.syn0
        print("2")

        # Build data loader
        # data_loader = get_loader(args.image_dir, args.caption_path, vocab,
        #                             args.dictionary, args.batch_size,
        #                             shuffle=True, num_workers=args.num_workers)
        
        # Build the models
        #encoder = EncoderCNN(256).to(device)
        self.dictionary = pd.read_csv("allcontent_required_NotNull_sum_out.dict", header=0,encoding = 'unicode_escape',error_bad_lines=False)
        self.dictionary = list(self.dictionary['keys'])
        print("3")
        self.decoder = DecoderRNN(256, 512, len(self.emb_model.wv.vocab), 2, self.emb_model_weights).to(device)
        self.decoder.load_state_dict(torch.load("allcontent_required_NotNull_sum_outFastText.ckpt", map_location=device))
        self.decoder.eval()


    def name(self) -> Text:
        return "action_tell_summary"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        topic_name = tracker.get_slot("topic")
        


	    # Train the models
	    # total_step = len(data_loader)
	    # for epoch in range(5):
	    # for i, (array, captions, lengths) in enumerate(data_loader):
        if(True):
            data = topic_name
	        
            array = torch.zeros((256))
            count = 0
            for val in data.split():
                array = torch.add(array, torch.from_numpy(self.emb_model.wv[val]))
                count += 1
            array = torch.div(array, count)
	            # print("In sample", array)
            array = (array, )
            array = torch.stack(array, 0)
            array = array.to(device)
	        # print("After", array)
	        #captions = captions.to(device)
	        # targets = pack_padded_sequence(captions, lengths, batch_first=True)[0]
	    
	        # Forward, backward and optimize
	        #features = encoder(images)
            outputs = self.decoder.sample(array)
	    
            count = 0
            sentence = ''
            for i in range(len(outputs)):
                sampled_ids = outputs[i].cpu().numpy()          # (1, max_seq_length) -> (max_seq_length)
	    
	            # Convert word_ids to words
                sampled_caption = []
                for word_id in sampled_ids:
                    count += 1
                    word = self.emb_model.wv.index2word[word_id]
                    sampled_caption.append(word)
                    if word == '<end>':
                        break
                sentence = sentence.join(' ')
                sentence = sentence.join(sampled_caption)
        dispatcher.utter_message(text = sentence)
        return []











