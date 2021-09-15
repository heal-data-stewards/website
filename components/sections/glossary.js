import React from "react"
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function Glossary({ data }) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    console.log(data.term)
    return (
        <main className="container py-12">
            <section className="pb-8">
                <h1 className="text-5xl font-black pb-8 text-purple">{data.title}</h1>
                <p className="text-xl text-gray-dark">{data.pagetext}</p>
            </section>
            <Paper elevation={2}>
                {data.term.map((word,i)=>{
                    return (
                        <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                Related Categories?
                            </Typography>
                            <Typography variant="h5" component="h2" className="text-magenta">
                                {word.title}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                                adjective etc
                            </Typography>
                            <Typography variant="body2" component="p">
                            {word.body}
                                {/* <br />
                                {'"a benevolent smile"'} */}
                            </Typography>
                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                    </Card>
                    )
                })}

            </Paper>
        </main>
    )
}
