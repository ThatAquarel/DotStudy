use std::{env, fs};
use futures::executor::block_on;
use pulldown_cmark::{Event, Parser, html, Tag, HeadingLevel};

use serenity::async_trait;
use serenity::model::channel::Message;
use serenity::model::gateway::Ready;
use serenity::model::Timestamp;
use serenity::prelude::*;

pub fn publish(filename: &String) -> Result<(), String> {
    block_on(_publish(filename))
}

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn ready(&self, _ctx: Context, _data_about_bot: Ready) {
        let channel = match _ctx.cache.channel("954420943697092693") {
            Some(channel) => channel,
            None => {
                return;
            }
        };
    }
}

struct SimpleMessage {
    text: String,
    image_path: String,
}

impl SimpleMessage {
   fn new() -> SimpleMessage {
       SimpleMessage {
           text: String::new(),
           image_path: String::new()
       }
   }
}

async fn _publish(filename: &String) -> Result<(), String> {
    let file_result = fs::read_to_string(filename);

    let file_string = match file_result {
        Ok(file_result) => file_result,
        Err(err) => return Err(err.to_string())
    };

    let mut messages: Vec<SimpleMessage> = vec![SimpleMessage::new()];

    let parser = Parser::new(&*file_string)
        .map(|event| {
            match &event {
                Event::Start(tag) => {
                    match tag {
                        Tag::Heading(heading_level, ..) => {
                            let mut simple_msg = messages.get(messages.len()-1).expect("Messages should not be empty");
                            simple_msg.text.push_str("**");
                        },
                    }
                },
                Event::End(tag) => println!("End: {:?}", tag),
                Event::Html(s) => println!("Html: {:?}", s),
                Event::Text(s) => println!("Text: {:?}", s),
                Event::Code(s) => println!("Code: {:?}", s),
                Event::FootnoteReference(s) => println!("FootnoteReference: {:?}", s),
                Event::TaskListMarker(b) => println!("TaskListMarker: {:?}", b),
                Event::SoftBreak => println!("SoftBreak"),
                Event::HardBreak => println!("HardBreak"),
                Event::Rule => println!("Rule"),
            };
            event
        });

    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");
    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT;
    let mut client =
        Client::builder(&token, intents).event_handler(Handler).await.expect("Err creating client");

    if let Err(why) = client.start().await {
        println!("Client error: {:?}", why);
    }

    Ok(())
}
