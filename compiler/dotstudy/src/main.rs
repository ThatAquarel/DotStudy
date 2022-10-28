mod commands;
mod discord;

use std::process::exit;
use clap::{arg, command, Command};

fn main() {
    let matches = command!()
        .propagate_version(true)
        .subcommand_required(true)
        .arg_required_else_help(true)
        .subcommands([
            Command::new("publish")
                .visible_alias("pub")
                .about("Publish study guide to Discord")
                .arg(arg!([FILENAME]).required(true)),
            Command::new("generate")
                .visible_alias("gen")
                .about("Generate static markdown")
                .arg(arg!([FILENAME]).required(true)),
            Command::new("remove")
                .visible_alias("rm")
                .about("Remove published study guide")
        ])
        .get_matches();

    match matches.subcommand() {
        Some(("publish", sub_matches)) => {
            let filename = sub_matches.get_one::<String>("FILENAME");
            match filename {
                None => unreachable!("Publish requires FILENAME argument."),
                Some(filename) => {
                    match commands::publish(filename) {
                        Ok(_) => {},
                        Err(err) => {
                            eprintln!("{}", err);
                            exit(-1);
                        }
                    }
                }
            }
        },
        Some(("generate", sub_matches)) => {
            let filename = sub_matches.get_one::<String>("FILENAME");
            match filename {
                None => {
                    unreachable!("Generate requires FILENAME argument.")
                }
                Some(filename) => {
                    commands::generate(filename);
                }
            }
        },
        Some(("remove", _)) => {
            commands::remove()
        }
        _ => unreachable!("Exhausted list of subcommands and subcommand_required prevents `None`"),
    }
}
