use std::{env, fs};
use std::path::{Path, PathBuf};
use futures::executor::block_on;
use pulldown_cmark::{Event, Parser, html, Tag, HeadingLevel, CowStr};

use serenity::async_trait;
use serenity::model::gateway::Ready;
use serenity::model::id::ChannelId;
use serenity::prelude::*;

pub fn publish(filename: &String) -> Result<(), String> {
    block_on(_publish(filename))
}

struct SimpleMessage {
    text: String,
    image_path: String,
}

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn ready(&self, _ctx: Context, _data_about_bot: Ready) {
        let message = ChannelId(954420943697092693)
            .send_message(&_ctx, |m| {
                m.content("test")
            })
            .await;

        if let Err(why) = message {
            eprintln!("Error sending message: {:?}", why);
        }
    }
}

async fn _publish(filename: &String) -> Result<(), String> {
    let file_path = Path::new(filename);
    if !file_path.exists() {
        return Err("File does not exist".parse().unwrap());
    }
    match file_path.extension() {
        Some(os_str) => {
            let extension = os_str.to_str().expect("should be string");

            if extension != "study" && extension != "md" {
                return Err("File extension not .study or .md".parse().unwrap());
            }
        }
        None => {
            return Err("File extension not .study".parse().unwrap());
        }
    }

    let file_folder = file_path.parent().expect("folder");

    let file_result = fs::read_to_string(filename);

    let file_string = match file_result {
        Ok(file_result) => file_result,
        Err(err) => return Err(err.to_string())
    };

    let mut messages: Vec<SimpleMessage> = vec![SimpleMessage {
        text: String::from(""),
        image_path: String::from(""),
    }];
    let mut vec_push_string = |is_image: bool, string: &str| {
        if is_image {
            let mut copy_str = String::new();
            copy_str.push_str(string);
            copy_str.retain(|c| !c.is_whitespace());

            let path = Path::new(&copy_str);
            if path.exists() {
                let mut path_builder = PathBuf::from(file_folder);
                path_builder.push(path);

                let msg_len = messages.len();
                messages[msg_len - 1].image_path.clear();
                let msg_len = messages.len();
                messages[msg_len - 1].image_path.push_str(path_builder.to_str().expect("str"));

                messages.push(SimpleMessage {
                    text: String::from(""),
                    image_path: String::from(""),
                });
                return;
            }
        }

        let msg_len = messages.len();
        if (messages[msg_len - 1].text.len() + string.len()) > 1500 {
            messages.push(SimpleMessage {
                text: String::from(""),
                image_path: String::from(""),
            });
        }
        let msg_len = messages.len();
        messages[msg_len - 1].text.push_str(string);
    };

    let mut list_item_count: Option<u64> = None;

    let parser = Parser::new(&*file_string)
        .map(|event| {
            match &event {
                Event::Start(tag) => {
                    match tag {
                        Tag::Heading(heading_level, ..) => {
                            match heading_level {
                                HeadingLevel::H1 => {
                                    vec_push_string(false, "`");
                                }
                                HeadingLevel::H2 => {
                                    vec_push_string(false, "\n** **\n__**");
                                }
                                HeadingLevel::H3 => {
                                    vec_push_string(false, "\n** **\n**");
                                }
                                _ => {}
                            };
                        }
                        Tag::Emphasis => {
                            vec_push_string(false, "*");
                        }
                        Tag::Strong => {
                            vec_push_string(false, "**");
                        }
                        Tag::List(list_option) => {
                            match list_option {
                                Some(list_start) => {
                                    list_item_count = Some(*list_start);
                                }
                                None => {
                                    list_item_count = None;
                                }
                            }
                        }
                        Tag::Item => {
                            match list_item_count {
                                Some(item) => {
                                    vec_push_string(false, &*format!("{}. ", item));
                                    list_item_count = Some(list_item_count.expect("item") + 1)
                                }
                                None => {
                                    vec_push_string(false, "- ");
                                }
                            };
                        }
                        _ => {}
                    };
                }
                Event::End(tag) => {
                    match tag {
                        Tag::Heading(heading_level, ..) => {
                            match heading_level {
                                HeadingLevel::H1 => {
                                    vec_push_string(false, "`");
                                }
                                HeadingLevel::H2 => {
                                    vec_push_string(false, "**__");
                                }
                                HeadingLevel::H3 => {
                                    vec_push_string(false, "**\n");
                                }
                                _ => {}
                            }
                        }
                        Tag::Emphasis => {
                            vec_push_string(false, "*");
                        }
                        Tag::Strong => {
                            vec_push_string(false, "**");
                        }
                        Tag::List(_) => {
                            list_item_count = None;
                        }
                        Tag::Item => {
                            vec_push_string(false, "\n");
                        }
                        _ => {}
                    };
                }
                Event::SoftBreak => {
                    vec_push_string(false, "\n");
                }
                Event::HardBreak => {
                    vec_push_string(false, "\n** **\n");
                }
                Event::Text(s) => {
                    match s {
                        CowStr::Borrowed(s) => {
                            let first_char = s.chars().nth(0).expect("First char");

                            if first_char == '&' {
                                let mut copy_str = String::new();
                                copy_str.push_str(s);
                                copy_str.retain(|c| !c.is_whitespace());
                            }

                            vec_push_string(first_char == '&', s);
                        }
                        _ => {}
                    }
                }
                _ => {}
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
